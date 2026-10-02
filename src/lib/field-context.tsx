"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NOTE_MAX, PROJECT_NAME_MAX } from "@/lib/constants";
import {
  ensureReady,
  insertCapture,
  readSnapshot,
  removeCapture,
  removeProject,
  resetDatabase,
  saveCapture,
  saveProject,
  saveSettings,
} from "@/lib/db";
import {
  canCreateProject,
  canExport,
  exportsRemaining,
  projectsRemaining,
} from "@/lib/limits";
import type { Capture, NewCaptureInput, Project, Settings } from "@/lib/types";

type FieldContextValue = {
  ready: boolean;
  error: string | null;
  projects: Project[];
  captures: Capture[];
  settings: Settings | null;
  urls: Record<string, string>;
  projectsRemaining: number;
  exportsRemaining: number;
  canCreate: boolean;
  canExport: boolean;
  createProject: (name: string) => Promise<{ ok: true; project: Project } | { ok: false; reason: "empty" | "limit" }>;
  renameProject: (id: string, name: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<void>;
  addCapture: (input: NewCaptureInput) => Promise<Capture>;
  updateNote: (id: string, note: string) => Promise<void>;
  moveCapture: (id: string, projectId: string) => Promise<void>;
  deleteCapture: (id: string) => Promise<void>;
  unlockPro: () => Promise<void>;
  lockPro: () => Promise<void>;
  recordExport: () => Promise<boolean>;
  resetDemo: () => Promise<void>;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function sortProjects(projects: Project[]) {
  return [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function sortCaptures(captures: Capture[]) {
  return [...captures].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function touchProject(projects: Project[], projectId: string) {
  const updatedAt = new Date().toISOString();
  return sortProjects(
    projects.map((project) =>
      project.id === projectId ? { ...project, updatedAt } : project,
    ),
  );
}

export function FieldProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    ensureReady()
      .then(() => readSnapshot())
      .then((snapshot) => {
        if (cancelled) {
          for (const url of Object.values(snapshot.urls)) URL.revokeObjectURL(url);
          return;
        }
        created.push(...Object.values(snapshot.urls));
        setProjects(snapshot.projects);
        setCaptures(snapshot.captures);
        setSettings(snapshot.settings);
        setUrls(snapshot.urls);
        setReady(true);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "StampField could not open local storage.",
        );
        setReady(true);
      });
    return () => {
      cancelled = true;
      for (const url of created) URL.revokeObjectURL(url);
    };
  }, []);

  const createProject = useCallback(
    async (name: string) => {
      if (!settings) return { ok: false as const, reason: "empty" as const };
      const trimmed = name.trim();
      if (!trimmed) return { ok: false as const, reason: "empty" as const };
      if (!canCreateProject(projects, settings)) {
        return { ok: false as const, reason: "limit" as const };
      }
      const now = new Date().toISOString();
      const project: Project = {
        id: crypto.randomUUID(),
        name: trimmed.slice(0, PROJECT_NAME_MAX),
        createdAt: now,
        updatedAt: now,
        sample: false,
      };
      await saveProject(project);
      setProjects((current) => sortProjects([project, ...current]));
      return { ok: true as const, project };
    },
    [projects, settings],
  );

  const renameProject = useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim();
      const current = projects.find((project) => project.id === id);
      if (!trimmed || !current) return false;
      const next: Project = {
        ...current,
        name: trimmed.slice(0, PROJECT_NAME_MAX),
        updatedAt: new Date().toISOString(),
      };
      await saveProject(next);
      setProjects((list) =>
        sortProjects(list.map((project) => (project.id === id ? next : project))),
      );
      return true;
    },
    [projects],
  );

  const deleteProject = useCallback(async (id: string) => {
    const removed = await removeProject(id);
    setProjects((current) => current.filter((project) => project.id !== id));
    setCaptures((current) =>
      current.filter((capture) => capture.projectId !== id),
    );
    setUrls((current) => {
      const next = { ...current };
      for (const captureId of removed) {
        if (next[captureId]) URL.revokeObjectURL(next[captureId]);
        delete next[captureId];
      }
      return next;
    });
  }, []);

  const addCapture = useCallback(async (input: NewCaptureInput) => {
    const capture = await insertCapture(
      { ...input, note: input.note.trim().slice(0, NOTE_MAX) },
      crypto.randomUUID(),
    );
    const url = URL.createObjectURL(input.blob);
    setCaptures((current) => sortCaptures([capture, ...current]));
    setUrls((current) => ({ ...current, [capture.id]: url }));
    setProjects((current) => touchProject(current, capture.projectId));
    return capture;
  }, []);

  const updateNote = useCallback(
    async (id: string, note: string) => {
      const current = captures.find((capture) => capture.id === id);
      if (!current) return;
      const saved: Capture = {
        ...current,
        note: note.trim().slice(0, NOTE_MAX),
      };
      await saveCapture(saved);
      setCaptures((list) =>
        list.map((capture) => (capture.id === id ? saved : capture)),
      );
      setProjects((list) => touchProject(list, saved.projectId));
    },
    [captures],
  );

  const moveCapture = useCallback(
    async (id: string, projectId: string) => {
      const current = captures.find((capture) => capture.id === id);
      if (!current || current.projectId === projectId) return;
      const fromProject = current.projectId;
      const saved: Capture = { ...current, projectId };
      await saveCapture(saved);
      setCaptures((list) =>
        list.map((capture) => (capture.id === id ? saved : capture)),
      );
      setProjects((list) => touchProject(touchProject(list, projectId), fromProject));
    },
    [captures],
  );

  const deleteCapture = useCallback(async (id: string) => {
    await removeCapture(id);
    setCaptures((current) => current.filter((capture) => capture.id !== id));
    setUrls((current) => {
      if (current[id]) URL.revokeObjectURL(current[id]);
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const unlockPro = useCallback(async () => {
    if (!settings) return;
    const next = { ...settings, proUnlocked: true };
    await saveSettings(next);
    setSettings(next);
  }, [settings]);

  const lockPro = useCallback(async () => {
    if (!settings) return;
    const next = { ...settings, proUnlocked: false };
    await saveSettings(next);
    setSettings(next);
  }, [settings]);

  const recordExport = useCallback(async () => {
    if (!settings || !canExport(settings)) return false;
    const next = { ...settings, exportCount: settings.exportCount + 1 };
    await saveSettings(next);
    setSettings(next);
    return true;
  }, [settings]);

  const resetDemo = useCallback(async () => {
    for (const url of Object.values(urls)) URL.revokeObjectURL(url);
    await resetDatabase();
    window.location.reload();
  }, [urls]);

  const value = useMemo<FieldContextValue>(() => {
    const activeSettings = settings;
    return {
      ready,
      error,
      projects,
      captures,
      settings,
      urls,
      projectsRemaining: activeSettings
        ? projectsRemaining(projects, activeSettings)
        : 0,
      exportsRemaining: activeSettings ? exportsRemaining(activeSettings) : 0,
      canCreate: activeSettings ? canCreateProject(projects, activeSettings) : false,
      canExport: activeSettings ? canExport(activeSettings) : false,
      createProject,
      renameProject,
      deleteProject,
      addCapture,
      updateNote,
      moveCapture,
      deleteCapture,
      unlockPro,
      lockPro,
      recordExport,
      resetDemo,
    };
  }, [
    ready,
    error,
    projects,
    captures,
    settings,
    urls,
    createProject,
    renameProject,
    deleteProject,
    addCapture,
    updateNote,
    moveCapture,
    deleteCapture,
    unlockPro,
    lockPro,
    recordExport,
    resetDemo,
  ]);

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>;
}

export function useField() {
  const value = useContext(FieldContext);
  if (!value) {
    throw new Error("useField must be used inside FieldProvider");
  }
  return value;
}
