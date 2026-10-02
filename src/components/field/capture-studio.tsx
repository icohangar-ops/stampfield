"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { StampOverlay } from "@/components/field/stamp-overlay";
import { QuotaDialog } from "@/components/field/quota-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NOTE_MAX, PROJECT_NAME_MAX } from "@/lib/constants";
import { useField } from "@/lib/field-context";
import { geolocationMessage, readDevicePosition, type DeviceFix } from "@/lib/geo";
import { formatCoords, parseCoord } from "@/lib/format";
import { fileToStoredImage } from "@/lib/images";
import { suggestFolder } from "@/lib/suggest";

type GpsStatus = "idle" | "locating" | "ready" | "denied" | "unavailable";

export function CaptureStudio() {
  const params = useSearchParams();
  const requestedProject = params.get("project");
  const { projects, createProject, addCapture } = useField();
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewUrl = useRef<string | null>(null);

  const [chosenProjectId, setChosenProjectId] = useState(requestedProject ?? "");
  const [note, setNote] = useState("");
  const [manual, setManual] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [device, setDevice] = useState<DeviceFix | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("locating");
  const [gpsMessage, setGpsMessage] = useState("Looking for a GPS fix…");
  const [preview, setPreview] = useState<string | null>(null);
  const [stored, setStored] = useState<{
    blob: Blob;
    width: number;
    height: number;
  } | null>(null);
  const [stampTime, setStampTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [quotaOpen, setQuotaOpen] = useState(false);

  const projectId =
    chosenProjectId && projects.some((project) => project.id === chosenProjectId)
      ? chosenProjectId
      : requestedProject && projects.some((project) => project.id === requestedProject)
        ? requestedProject
        : (projects[0]?.id ?? "");

  useEffect(() => {
    return () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    };
  }, []);

  async function refreshGps() {
    setGpsStatus("locating");
    setGpsMessage("Looking for a GPS fix…");
    try {
      const fix = await readDevicePosition();
      setDevice(fix);
      setGpsStatus("ready");
      setGpsMessage(`Device fix ${formatCoords(fix.lat, fix.lng)}.`);
      setLat((current) => current || fix.lat.toFixed(6));
      setLng((current) => current || fix.lng.toFixed(6));
    } catch (error) {
      setDevice(null);
      const denied =
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as GeolocationPositionError).code === 1;
      setGpsStatus(denied ? "denied" : "unavailable");
      setGpsMessage(geolocationMessage(error));
    }
  }

  useEffect(() => {
    let cancelled = false;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        const fix = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyM: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null,
        };
        setDevice(fix);
        setGpsStatus("ready");
        setGpsMessage(`Device fix ${formatCoords(fix.lat, fix.lng)}.`);
        setLat((current) => current || fix.lat.toFixed(6));
        setLng((current) => current || fix.lng.toFixed(6));
      },
      (error) => {
        if (cancelled) return;
        setDevice(null);
        const denied = error.code === 1;
        setGpsStatus(denied ? "denied" : "unavailable");
        setGpsMessage(geolocationMessage(error));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const image = await fileToStoredImage(file);
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      const url = URL.createObjectURL(image.blob);
      previewUrl.current = url;
      setPreview(url);
      setStored(image);
      setStampTime(new Date().toISOString());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that photo.");
    }
  }

  const suggestion = useMemo(
    () => suggestFolder(note, projects),
    [note, projects],
  );
  const showSuggestion =
    suggestion &&
    suggestion.matchedProjectId !== projectId &&
    suggestion.label !== projects.find((project) => project.id === projectId)?.name;

  const manualLat = parseCoord(lat, "lat");
  const manualLng = parseCoord(lng, "lng");
  const stampLat = manual ? manualLat : (device?.lat ?? null);
  const stampLng = manual ? manualLng : (device?.lng ?? null);
  const stampSource = manual
    ? "manual"
    : device
      ? "device"
      : "unavailable";
  const manualInvalid = manual && (manualLat == null || manualLng == null);

  async function onSave() {
    if (!stored || !stampTime || !projectId) {
      toast.error("Choose a project and a photo first.");
      return;
    }
    if (manualInvalid) {
      toast.error("Enter a latitude between -90 and 90 and a longitude between -180 and 180.");
      return;
    }
    setSaving(true);
    try {
      await addCapture({
        projectId,
        note,
        lat: stampLat,
        lng: stampLng,
        accuracyM: manual ? null : (device?.accuracyM ?? null),
        gpsSource: stampSource,
        blob: stored.blob,
        width: stored.width,
        height: stored.height,
      });
      toast.success("Photo stamped and saved on this device.");
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
      setPreview(null);
      setStored(null);
      setStampTime(null);
      setNote("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the photo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Capture</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Stamp a photo with coordinates, an ISO time, and a short note. The
          overlay is a preview. The saved file stays in this browser.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <section className="space-y-3" aria-label="Photo preview">
          <div className="relative overflow-hidden rounded-xl border border-border bg-[#1c1915]">
            {preview ? (
              // Local object URLs cannot go through next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview of the photo about to be stamped"
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm text-[#f6f3ec]/80">
                Take or upload a photo to preview the stamp.
              </div>
            )}
            <StampOverlay
              lat={stampLat}
              lng={stampLng}
              accuracyM={manual ? null : (device?.accuracyM ?? null)}
              takenAt={stampTime ?? "Time stamps when you choose a photo"}
              note={note}
              source={stampSource}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="min-h-11" onClick={() => cameraRef.current?.click()}>
              Take photo
            </Button>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => fileRef.current?.click()}
            >
              Upload image
            </Button>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(event) => {
                void onFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                void onFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>
        </section>

        <form
          className="space-y-4 rounded-xl border border-border bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onSave();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="capture-project">Project</Label>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Create a project before saving.</p>
            ) : (
              <Select value={projectId} onValueChange={setChosenProjectId}>
                <SelectTrigger id="capture-project" className="min-h-11 w-full">
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button type="button" variant="outline" className="min-h-11" onClick={() => setCreateOpen(true)}>
              New project
            </Button>
          </div>

          <div className="space-y-2" aria-live="polite">
            <div className="flex items-center justify-between gap-2">
              <Label>Location</Label>
              <Button type="button" variant="ghost" className="min-h-11" onClick={() => void refreshGps()}>
                Refresh GPS
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {gpsStatus === "locating"
                  ? "Locating"
                  : gpsStatus === "ready"
                    ? "Fix ready"
                    : gpsStatus === "denied"
                      ? "Permission denied"
                      : "No device fix"}
                .{" "}
              </span>
              {gpsMessage}
            </p>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={manual}
                onChange={(event) => setManual(event.target.checked)}
              />
              Enter coordinates manually
            </label>
            {manual ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    inputMode="decimal"
                    value={lat}
                    onChange={(event) => setLat(event.target.value)}
                    className="min-h-11 font-mono"
                    aria-invalid={manual && manualLat == null}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    inputMode="decimal"
                    value={lng}
                    onChange={(event) => setLng(event.target.value)}
                    className="min-h-11 font-mono"
                    aria-invalid={manual && manualLng == null}
                  />
                </div>
              </div>
            ) : null}
            {manualInvalid ? (
              <p className="text-sm text-destructive" role="alert">
                Latitude must be -90 to 90. Longitude must be -180 to 180.
              </p>
            ) : null}
            {!manual && !device ? (
              <p className="text-sm text-muted-foreground">
                You can still save. The stamp will say coordinates were not recorded.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              maxLength={NOTE_MAX}
              onChange={(event) => setNote(event.target.value)}
              placeholder="North bank, iron staining, second-floor crack…"
              className="min-h-24"
            />
            <p className="text-xs text-muted-foreground">
              {note.trim().length}/{NOTE_MAX}
            </p>
            {showSuggestion && suggestion ? (
              <div className="rounded-lg bg-secondary px-3 py-2 text-sm">
                <p>
                  Suggested folder: <strong>{suggestion.label}</strong>
                </p>
                <p className="text-muted-foreground">{suggestion.reason}. Keyword match only — nothing is sent off this device.</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 min-h-11"
                  onClick={() => {
                      if (suggestion.matchedProjectId) {
                      setChosenProjectId(suggestion.matchedProjectId);
                      return;
                    }
                    void createProject(suggestion.label).then((result) => {
                      if (!result.ok && result.reason === "limit") {
                        setQuotaOpen(true);
                        return;
                      }
                      if (result.ok) setChosenProjectId(result.project.id);
                    });
                  }}
                >
                  {suggestion.matchedProjectId ? "File in that project" : "Create that folder"}
                </Button>
              </div>
            ) : null}
          </div>

          <Button type="submit" className="min-h-11 w-full" disabled={saving || !stored}>
            {saving ? "Saving…" : "Save stamped photo"}
          </Button>
        </form>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>The photo will be filed in this folder.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-project">Project name</Label>
            <Input
              id="new-project"
              value={newName}
              maxLength={PROJECT_NAME_MAX}
              className="min-h-11"
              onChange={(event) => setNewName(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                void createProject(newName).then((result) => {
                  if (!result.ok && result.reason === "limit") {
                    setCreateOpen(false);
                    setQuotaOpen(true);
                    return;
                  }
                  if (!result.ok) {
                    toast.error("Enter a project name.");
                    return;
                  }
                  setChosenProjectId(result.project.id);
                  setNewName("");
                  setCreateOpen(false);
                });
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <QuotaDialog open={quotaOpen} onOpenChange={setQuotaOpen} kind="projects" />
    </div>
  );
}
