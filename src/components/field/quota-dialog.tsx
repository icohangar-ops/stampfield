"use client";

import Link from "next/link";
import { LITE_EXPORT_LIMIT, LITE_PROJECT_LIMIT, PRO_PRICE } from "@/lib/constants";
import { formatRemaining } from "@/lib/limits";
import { useField } from "@/lib/field-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function QuotaDialog({
  open,
  onOpenChange,
  kind,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: "projects" | "exports";
}) {
  const { unlockPro, settings, projectsRemaining, exportsRemaining } = useField();
  const title =
    kind === "projects"
      ? "Lite includes two projects you create"
      : "Lite includes four exports";
  const body =
    kind === "projects"
      ? `Sample folders stay available. Pro (${PRO_PRICE} once, on this device) removes the ${LITE_PROJECT_LIMIT}-project cap. No subscription and no account.`
      : `Each PDF or CSV counts once. Pro (${PRO_PRICE} once) removes the ${LITE_EXPORT_LIMIT}-export cap. This demo stores the unlock locally and does not take payment.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {settings?.proUnlocked
            ? "Pro is already unlocked on this device."
            : `Remaining ${kind === "projects" ? "project slots" : "exports"}: ${formatRemaining(kind === "projects" ? projectsRemaining : exportsRemaining)}.`}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          {settings?.proUnlocked ? (
            <Button asChild>
              <Link href="/field/settings">Review unlock</Link>
            </Button>
          ) : (
            <Button
              onClick={() => {
                void unlockPro().then(() => onOpenChange(false));
              }}
            >
              Unlock Pro for {PRO_PRICE}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
