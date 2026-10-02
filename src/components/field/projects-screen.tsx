"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { QuotaDialog } from "@/components/field/quota-dialog";
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
import { PROJECT_NAME_MAX } from "@/lib/constants";
import { formatLocal } from "@/lib/format";
import { useField } from "@/lib/field-context";

export function ProjectsScreen() {
  const { projects, captures, createProject, renameProject, deleteProject } =
    useField();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleting = projects.find((project) => project.id === deleteId);

  async function onCreate() {
    const result = await createProject(name);
    if (!result.ok && result.reason === "limit") {
      setCreateOpen(false);
      setQuotaOpen(true);
      return;
    }
    if (!result.ok) {
      toast.error("Enter a project name.");
      return;
    }
    setName("");
    setCreateOpen(false);
    toast.success(`Created ${result.project.name}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Projects</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Folders live in this browser. Sample surveys are already loaded so
            you can open a stamp without a camera.
          </p>
        </div>
        <Button className="min-h-11" onClick={() => setCreateOpen(true)}>
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6">
          <h2 className="font-heading text-xl">No folders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a project for a site visit, then stamp photos into it.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => {
            const count = captures.filter(
              (capture) => capture.projectId === project.id,
            ).length;
            return (
              <li
                key={project.id}
                className="flex flex-col rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-xl leading-tight">
                      <Link
                        href={`/field/projects/${project.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {project.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {count} photo{count === 1 ? "" : "s"} · updated{" "}
                      {formatLocal(project.updatedAt)}
                    </p>
                  </div>
                  {project.sample ? (
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                      Sample
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild className="min-h-11">
                    <Link href={`/field/projects/${project.id}`}>Open</Link>
                  </Button>
                  <Button asChild variant="outline" className="min-h-11">
                    <Link href={`/field/capture?project=${project.id}`}>
                      Add photo
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-11"
                    onClick={() => {
                      setRenameId(project.id);
                      setRenameValue(project.name);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-11 text-destructive"
                    onClick={() => setDeleteId(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Name the site, survey, or inspection. You can rename it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              value={name}
              maxLength={PROJECT_NAME_MAX}
              className="min-h-11"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void onCreate();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button className="min-h-11" onClick={() => void onCreate()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renameId != null} onOpenChange={(open) => !open && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              The new name is stored only on this device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-project">Project name</Label>
            <Input
              id="rename-project"
              value={renameValue}
              maxLength={PROJECT_NAME_MAX}
              className="min-h-11"
              onChange={(event) => setRenameValue(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!renameId) return;
                void renameProject(renameId, renameValue).then((ok) => {
                  if (!ok) {
                    toast.error("Enter a project name.");
                    return;
                  }
                  setRenameId(null);
                  toast.success("Project renamed");
                });
              }}
            >
              Save name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name ?? "this project"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the folder and every photo in it from this browser.
              Export a PDF first if you still need the set.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!deleteId) return;
                void deleteProject(deleteId).then(() => {
                  toast.success("Project deleted");
                  setDeleteId(null);
                });
              }}
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuotaDialog open={quotaOpen} onOpenChange={setQuotaOpen} kind="projects" />
    </div>
  );
}
