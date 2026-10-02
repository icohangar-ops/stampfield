"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
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
  LITE_EXPORT_LIMIT,
  LITE_PROJECT_LIMIT,
  PRO_PRICE,
} from "@/lib/constants";
import { formatRemaining } from "@/lib/limits";
import { useField } from "@/lib/field-context";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function SettingsScreen() {
  const {
    settings,
    projectsRemaining,
    exportsRemaining,
    unlockPro,
    lockPro,
    resetDemo,
  } = useField();
  const { theme, setTheme } = useTheme();
  const [resetOpen, setResetOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          StampField Lite needs no account. Pro is a one-time unlock stored on
          this device.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4" aria-labelledby="plan-heading">
        <h2 id="plan-heading" className="font-heading text-2xl">
          {settings?.proUnlocked ? "Pro is unlocked" : `Pro · ${PRO_PRICE} once`}
        </h2>
        <ul className="space-y-2 text-sm">
          <li>Lite: {LITE_PROJECT_LIMIT} projects you create, plus the sample folders.</li>
          <li>Lite: {LITE_EXPORT_LIMIT} PDF or CSV downloads.</li>
          <li>Pro: unlimited projects and exports. Still local. Still no subscription.</li>
          <li>
            Remaining now: {formatRemaining(projectsRemaining)} project slots,{" "}
            {formatRemaining(exportsRemaining)} exports.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          This demo does not charge a card. Unlocking writes a flag in local
          storage so you can see the ungated app. A shipped version would sell
          the same {PRO_PRICE} unlock once.
        </p>
        {settings?.proUnlocked ? (
          <Button variant="outline" className="min-h-11" onClick={() => void lockPro()}>
            Return this device to Lite
          </Button>
        ) : (
          <Button
            className="min-h-11"
            onClick={() => {
              void unlockPro().then(() => toast.success("Pro unlocked on this device"));
            }}
          >
            Unlock Pro for {PRO_PRICE}
          </Button>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="install-heading">
        <h2 id="install-heading" className="font-heading text-2xl">
          Install and offline
        </h2>
        <p className="text-sm text-muted-foreground">
          After the production app is installed, capture and gallery keep
          working without a network. There is no cloud sync. Clearing site data
          deletes the photos.
        </p>
        {installEvent ? (
          <Button
            className="min-h-11"
            onClick={() => {
              void installEvent.prompt();
            }}
          >
            Install StampField
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            If the browser offers to install StampField, use that prompt. On
            iPhone, open the Share sheet and choose Add to Home Screen.
          </p>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="theme-heading">
        <h2 id="theme-heading" className="font-heading text-2xl">
          Daylight
        </h2>
        <p className="text-sm text-muted-foreground">
          Daylight is the high-contrast paper theme. Dusk is for late site walks.
        </p>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Use daylight theme" : "Use dusk theme"}
        </Button>
      </section>

      <section className="space-y-3" aria-labelledby="reset-heading">
        <h2 id="reset-heading" className="font-heading text-2xl">
          Reset this device
        </h2>
        <p className="text-sm text-muted-foreground">
          Deletes projects, photos, and the Pro flag, then reloads the two
          sample surveys.
        </p>
        <Button variant="destructive" className="min-h-11" onClick={() => setResetOpen(true)}>
          Clear local field data
        </Button>
      </section>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear everything stored here?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Sample projects are recreated after the reload.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep data</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => void resetDemo()}>
              Clear and reload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
