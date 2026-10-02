import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from "idb";
import {
  DB_NAME,
  DB_VERSION,
  SAMPLE_CAPTURE_BANK,
  SAMPLE_CAPTURE_CULVERT,
  SAMPLE_CAPTURE_FACADE,
  SAMPLE_PROJECT_FACADE,
  SAMPLE_PROJECT_WETLAND,
  SETTINGS_ID,
} from "@/lib/constants";
import type { Capture, NewCaptureInput, Project, Settings } from "@/lib/types";
import { paintSample } from "@/lib/sample-art";

interface StampFieldDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
  };
  captures: {
    key: string;
    value: Capture;
    indexes: { "by-project": string };
  };
  blobs: {
    key: string;
    value: Blob;
  };
  meta: {
    key: string;
    value: Settings;
  };
}

export type FieldSnapshot = {
  projects: Project[];
  captures: Capture[];
  settings: Settings;
  urls: Record<string, string>;
};

const defaultSettings = (): Settings => ({
  id: SETTINGS_ID,
  seeded: false,
  proUnlocked: false,
  exportCount: 0,
});

let databasePromise: Promise<IDBPDatabase<StampFieldDB>> | null = null;
let readyPromise: Promise<void> | null = null;

function requireBrowser() {
  if (typeof indexedDB === "undefined") {
    throw new Error("This browser cannot store StampField data locally.");
  }
}

export function getDb() {
  requireBrowser();
  if (!databasePromise) {
    databasePromise = openDB<StampFieldDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("captures")) {
          const store = db.createObjectStore("captures", { keyPath: "id" });
          store.createIndex("by-project", "projectId");
        }
        if (!db.objectStoreNames.contains("blobs")) {
          db.createObjectStore("blobs");
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "id" });
        }
      },
    });
  }
  return databasePromise;
}

async function seedSamples(db: IDBPDatabase<StampFieldDB>) {
  const existing = await db.get("meta", SETTINGS_ID);
  if (existing?.seeded) return;

  const bank = await paintSample("bank");
  const culvert = await paintSample("culvert");
  const facade = await paintSample("facade");

  const wetland: Project = {
    id: SAMPLE_PROJECT_WETLAND,
    name: "Riverside Wetland Survey",
    createdAt: "2026-09-18T15:10:00.000Z",
    updatedAt: "2026-09-18T16:05:00.000Z",
    sample: true,
  };
  const facadeProject: Project = {
    id: SAMPLE_PROJECT_FACADE,
    name: "Oak Street Facade Check",
    createdAt: "2026-09-20T17:40:00.000Z",
    updatedAt: "2026-09-20T18:05:44.000Z",
    sample: true,
  };

  const captures: Capture[] = [
    {
      id: SAMPLE_CAPTURE_BANK,
      projectId: wetland.id,
      createdAt: "2026-09-18T15:42:11.000Z",
      note: "North bank, sparse cattail cover after drawdown. Flag for sediment sample.",
      lat: 47.6512,
      lng: -122.3489,
      accuracyM: 6,
      gpsSource: "device",
      mimeType: "image/jpeg",
      width: bank.width,
      height: bank.height,
      byteSize: bank.blob.size,
      sample: true,
    },
    {
      id: SAMPLE_CAPTURE_CULVERT,
      projectId: wetland.id,
      createdAt: "2026-09-18T16:05:00.000Z",
      note: "South culvert outlet, iron staining on riprap. Recheck after the next rain.",
      lat: 47.65205,
      lng: -122.3474,
      accuracyM: 9,
      gpsSource: "device",
      mimeType: "image/jpeg",
      width: culvert.width,
      height: culvert.height,
      byteSize: culvert.blob.size,
      sample: true,
    },
    {
      id: SAMPLE_CAPTURE_FACADE,
      projectId: facadeProject.id,
      createdAt: "2026-09-20T18:05:44.000Z",
      note: "West elevation, hairline crack above the second-floor window. Measure on the next visit.",
      lat: 47.61452,
      lng: -122.3218,
      accuracyM: null,
      gpsSource: "manual",
      mimeType: "image/jpeg",
      width: facade.width,
      height: facade.height,
      byteSize: facade.blob.size,
      sample: true,
    },
  ];

  const tx = db.transaction(["projects", "captures", "blobs", "meta"], "readwrite");
  await Promise.all([
    tx.objectStore("projects").put(wetland),
    tx.objectStore("projects").put(facadeProject),
    ...captures.map((capture) => tx.objectStore("captures").put(capture)),
    tx.objectStore("blobs").put(bank.blob, SAMPLE_CAPTURE_BANK),
    tx.objectStore("blobs").put(culvert.blob, SAMPLE_CAPTURE_CULVERT),
    tx.objectStore("blobs").put(facade.blob, SAMPLE_CAPTURE_FACADE),
    tx.objectStore("meta").put({
      ...(existing ?? defaultSettings()),
      id: SETTINGS_ID,
      seeded: true,
    }),
    tx.done,
  ]);
}

export function ensureReady() {
  if (!readyPromise) {
    readyPromise = getDb()
      .then((db) => seedSamples(db))
      .catch((error) => {
        readyPromise = null;
        throw error;
      });
  }
  return readyPromise;
}

function sortProjects(projects: Project[]) {
  return [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function sortCaptures(captures: Capture[]) {
  return [...captures].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function readSnapshot(): Promise<FieldSnapshot> {
  await ensureReady();
  const db = await getDb();
  const [projects, captures, settings] = await Promise.all([
    db.getAll("projects"),
    db.getAll("captures"),
    db.get("meta", SETTINGS_ID),
  ]);
  const urls: Record<string, string> = {};
  await Promise.all(
    captures.map(async (capture) => {
      const blob = await db.get("blobs", capture.id);
      if (blob) urls[capture.id] = URL.createObjectURL(blob);
    }),
  );
  return {
    projects: sortProjects(projects),
    captures: sortCaptures(captures),
    settings: settings ?? { ...defaultSettings(), seeded: true },
    urls,
  };
}

export async function saveProject(project: Project) {
  const db = await getDb();
  await db.put("projects", project);
}

export async function removeProject(projectId: string) {
  const db = await getDb();
  const captures = await db.getAllFromIndex("captures", "by-project", projectId);
  const tx = db.transaction(["projects", "captures", "blobs"], "readwrite");
  await Promise.all([
    tx.objectStore("projects").delete(projectId),
    ...captures.flatMap((capture) => [
      tx.objectStore("captures").delete(capture.id),
      tx.objectStore("blobs").delete(capture.id),
    ]),
    tx.done,
  ]);
  return captures.map((capture) => capture.id);
}

export async function saveCapture(capture: Capture, blob?: Blob) {
  const db = await getDb();
  const tx = db.transaction(["captures", "blobs", "projects"], "readwrite");
  const project = await tx.objectStore("projects").get(capture.projectId);
  await Promise.all([
    tx.objectStore("captures").put(capture),
    blob ? tx.objectStore("blobs").put(blob, capture.id) : Promise.resolve(),
    project
      ? tx.objectStore("projects").put({
          ...project,
          updatedAt: new Date().toISOString(),
        })
      : Promise.resolve(),
    tx.done,
  ]);
}

export async function insertCapture(input: NewCaptureInput, id: string) {
  const createdAt = new Date().toISOString();
  const capture: Capture = {
    id,
    projectId: input.projectId,
    createdAt,
    note: input.note,
    lat: input.lat,
    lng: input.lng,
    accuracyM: input.accuracyM,
    gpsSource: input.gpsSource,
    mimeType: "image/jpeg",
    width: input.width,
    height: input.height,
    byteSize: input.blob.size,
    sample: false,
  };
  await saveCapture(capture, input.blob);
  return capture;
}

export async function removeCapture(captureId: string) {
  const db = await getDb();
  const tx = db.transaction(["captures", "blobs"], "readwrite");
  await Promise.all([
    tx.objectStore("captures").delete(captureId),
    tx.objectStore("blobs").delete(captureId),
    tx.done,
  ]);
}

export async function getBlob(captureId: string) {
  const db = await getDb();
  return db.get("blobs", captureId);
}

export async function saveSettings(settings: Settings) {
  const db = await getDb();
  await db.put("meta", settings);
}

export async function resetDatabase() {
  if (databasePromise) {
    const db = await databasePromise;
    db.close();
  }
  databasePromise = null;
  readyPromise = null;
  await deleteDB(DB_NAME);
}
