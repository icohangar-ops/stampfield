"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QuotaDialog } from "@/components/field/quota-dialog";
import { StampMap } from "@/components/field/stamp-map";
import { GalleryScreen } from "@/components/field/gallery-screen";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getBlob } from "@/lib/db";
import { downloadCaptureCsv, downloadProjectPdf } from "@/lib/export-report";
import { useField } from "@/lib/field-context";

export function ProjectScreen() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const {
    projects,
    captures,
    settings,
    deleteProject,
    recordExport,
    canExport,
  } = useField();
  const project = projects.find((item) => item.id === id);
  const projectCaptures = captures.filter((capture) => capture.projectId === id);
  const [busy, setBusy] = useState<"pdf" | "csv" | null>(null);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (project) document.title = `${project.name} · StampField`;
  }, [project]);

  if (!project) {
    return (
      <div className="max-w-lg space-y-3">
        <h1 className="font-heading text-3xl">Project not on this device</h1>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or this browser has not stored it.
        </p>
        <Button asChild>
          <Link href="/field">Back to projects</Link>
        </Button>
      </div>
    );
  }

  const points = [...projectCaptures]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .flatMap((capture, index) =>
      capture.lat != null && capture.lng != null
        ? [{ lat: capture.lat, lng: capture.lng, label: String(index + 1) }]
        : [],
    );

  async function runExport(kind: "pdf" | "csv") {
    if (!project || !settings) return;
    if (!canExport) {
      setQuotaOpen(true);
      return;
    }
    setBusy(kind);
    try {
      if (kind === "csv") {
        downloadCaptureCsv(project, projectCaptures);
      } else {
        const blobs = new Map<string, Blob>();
        for (const capture of projectCaptures) {
          const blob = await getBlob(capture.id);
          if (blob) blobs.set(capture.id, blob);
        }
        await downloadProjectPdf(
          project,
          projectCaptures,
          blobs,
          settings.proUnlocked,
        );
      }
      const counted = await recordExport();
      if (!counted) {
        setQuotaOpen(true);
        return;
      }
      toast.success(kind === "pdf" ? "PDF report downloaded" : "CSV downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/field" className="underline-offset-4 hover:underline">
              Projects
            </Link>
          </p>
          <h1 className="font-heading text-3xl tracking-tight">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projectCaptures.length} stamped photo{projectCaptures.length === 1 ? "" : "s"}
            {project.sample ? " · sample folder" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="min-h-11">
            <Link href={`/field/capture?project=${project.id}`}>Add photo</Link>
          </Button>
          <Button
            variant="outline"
            className="min-h-11"
            disabled={busy != null}
            onClick={() => void runExport("pdf")}
          >
            {busy === "pdf" ? "Building PDF…" : "Export PDF"}
          </Button>
          <Button
            variant="outline"
            className="min-h-11"
            disabled={busy != null}
            onClick={() => void runExport("csv")}
          >
            {busy === "csv" ? "Building CSV…" : "Export CSV"}
          </Button>
          <Button
            variant="ghost"
            className="min-h-11 text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <section className="space-y-2" aria-labelledby="map-heading">
        <h2 id="map-heading" className="font-heading text-xl">
          Stamp map
        </h2>
        <p className="text-sm text-muted-foreground">
          A relative plot of the coordinates saved with each photo. It is not a
          survey basemap.
        </p>
        <StampMap points={points} />
      </section>

      <GalleryScreen initialProjectId={project.id} embedded />

      <QuotaDialog open={quotaOpen} onOpenChange={setQuotaOpen} kind="exports" />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {project.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Photos in this folder are removed from this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                void deleteProject(project.id).then(() => {
                  router.push("/field");
                });
              }}
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
