"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StampOverlay } from "@/components/field/stamp-overlay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NOTE_MAX } from "@/lib/constants";
import { useField } from "@/lib/field-context";
import { formatCoords, formatLocal, gpsSourceLabel } from "@/lib/format";
import { suggestFolder } from "@/lib/suggest";
import type { Capture } from "@/lib/types";

export function GalleryScreen({
  initialProjectId,
  embedded = false,
}: {
  initialProjectId?: string;
  embedded?: boolean;
}) {
  const { projects, captures, urls, updateNote, moveCapture, deleteCapture } =
    useField();
  const [filter, setFilter] = useState(initialProjectId ?? "all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const visible = useMemo(
    () =>
      captures.filter((capture) =>
        filter === "all" ? true : capture.projectId === filter,
      ),
    [captures, filter],
  );
  const active = captures.find((capture) => capture.id === openId) ?? null;

  function openCapture(capture: Capture) {
    setOpenId(capture.id);
    setDraft(capture.note);
  }

  const suggestion = active
    ? suggestFolder(draft, projects)
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {embedded ? (
            <h2 className="font-heading text-xl">Photos</h2>
          ) : (
            <h1 className="font-heading text-3xl tracking-tight">Gallery</h1>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            Browse stamps, edit the note, or remove a photo from this device.
          </p>
        </div>
        {embedded ? null : (
          <div className="space-y-1">
            <Label htmlFor="gallery-filter">Project</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger id="gallery-filter" className="min-h-11 w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6">
          <h2 className="font-heading text-xl">Nothing in this view</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Stamp a photo from Capture, or switch the project filter.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((capture) => {
            const project = projects.find((item) => item.id === capture.projectId);
            return (
              <li key={capture.id}>
                <button
                  type="button"
                  onClick={() => openCapture(capture)}
                  className="w-full overflow-hidden rounded-xl border border-border bg-card text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                >
                  <span className="relative block">
                    {urls[capture.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={urls[capture.id]}
                        alt=""
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <span className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
                        Photo missing
                      </span>
                    )}
                    <StampOverlay
                      lat={capture.lat}
                      lng={capture.lng}
                      accuracyM={capture.accuracyM}
                      takenAt={capture.createdAt}
                      note={capture.note}
                      source={capture.gpsSource}
                    />
                  </span>
                  <span className="block space-y-1 px-3 py-3">
                    <span className="block font-medium">{project?.name ?? "Unknown project"}</span>
                    <span className="block text-sm text-muted-foreground">
                      {formatLocal(capture.createdAt)} · {formatCoords(capture.lat, capture.lng)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={active != null} onOpenChange={(open) => !open && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {active ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {projects.find((project) => project.id === active.projectId)?.name ?? "Capture"}
                </DialogTitle>
                <DialogDescription>
                  {formatLocal(active.createdAt)} · {gpsSourceLabel(active.gpsSource)} ·{" "}
                  {formatCoords(active.lat, active.lng)}
                </DialogDescription>
              </DialogHeader>
              <div className="relative overflow-hidden rounded-lg">
                {urls[active.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[active.id]}
                    alt={`Field photo from ${formatLocal(active.createdAt)}`}
                    className="max-h-80 w-full object-cover"
                  />
                ) : null}
                <StampOverlay
                  lat={active.lat}
                  lng={active.lng}
                  accuracyM={active.accuracyM}
                  takenAt={active.createdAt}
                  note={draft}
                  source={active.gpsSource}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note">Note</Label>
                <Textarea
                  id="edit-note"
                  value={draft}
                  maxLength={NOTE_MAX}
                  onChange={(event) => setDraft(event.target.value)}
                  className="min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="move-project">Project</Label>
                <Select
                  value={active.projectId}
                  onValueChange={(value) => {
                    void moveCapture(active.id, value).then(() => {
                      toast.success("Moved to that project");
                    });
                  }}
                >
                  <SelectTrigger id="move-project" className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {suggestion && suggestion.matchedProjectId !== active.projectId ? (
                <p className="text-sm text-muted-foreground">
                  Suggested folder from the note: {suggestion.label}. {suggestion.reason}.
                </p>
              ) : null}
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    void deleteCapture(active.id).then(() => {
                      setOpenId(null);
                      toast.success("Photo deleted");
                    });
                  }}
                >
                  Delete photo
                </Button>
                <Button
                  onClick={() => {
                    void updateNote(active.id, draft).then(() => {
                      toast.success("Note saved");
                      setOpenId(null);
                    });
                  }}
                >
                  Save note
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
