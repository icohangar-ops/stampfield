"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Camera,
  FolderClosed,
  Images,
  Settings,
} from "lucide-react";
import { useOffline } from "next/offline";
import { Mark } from "@/components/brand/mark";
import { formatRemaining } from "@/lib/limits";
import { useField } from "@/lib/field-context";
import { cn } from "cn";

const NAV = [
  { href: "/field", label: "Projects", icon: FolderClosed },
  { href: "/field/capture", label: "Capture", icon: Camera },
  { href: "/field/gallery", label: "Gallery", icon: Images },
  { href: "/field/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/field") {
    return pathname === "/field" || pathname.startsWith("/field/projects");
  }
  return pathname === href;
}

function useBrowserOffline() {
  const frameworkOffline = useOffline();
  const [browserOffline, setBrowserOffline] = useState(false);

  useEffect(() => {
    const sync = () => setBrowserOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return frameworkOffline || browserOffline;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const offline = useBrowserOffline();
  const field = useField();

  return (
    <div className="min-h-full bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to field content
      </a>
      <div className="mx-auto flex min-h-full w-full max-w-6xl md:grid md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border md:flex md:flex-col md:gap-6 md:px-4 md:py-6">
          <Link href="/" className="rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring">
            <Mark />
          </Link>
          <nav aria-label="Field" className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
            <Link href="/" className="md:hidden">
              <Mark />
            </Link>
            <p className="hidden text-sm text-muted-foreground md:block">
              Field book on this device
            </p>
            <p className="text-right text-xs text-muted-foreground sm:text-sm">
              {field.settings?.proUnlocked ? (
                <span className="font-medium text-foreground">Pro unlocked</span>
              ) : (
                <>
                  Lite · {formatRemaining(field.projectsRemaining)} project slots ·{" "}
                  {formatRemaining(field.exportsRemaining)} exports
                </>
              )}
            </p>
          </header>
          {offline ? (
            <p
              role="status"
              className="bg-[#9a3412] px-4 py-2 text-sm text-[#fff7f2]"
            >
              Offline. Photos already stored on this device stay available.
              Pages you have not opened yet may need a connection.
            </p>
          ) : null}
          <main id="main" className="flex-1 px-4 py-5 pb-28 md:pb-10">
            {!field.ready ? (
              <p className="text-muted-foreground">Opening the field book…</p>
            ) : field.error ? (
              <div className="max-w-lg rounded-xl border border-border bg-card p-5">
                <h1 className="font-heading text-2xl">Local storage is unavailable</h1>
                <p className="mt-2 text-sm text-muted-foreground">{field.error}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  StampField keeps projects and photos in this browser. Private
                  mode or a blocked storage policy can prevent that.
                </p>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
      <nav
        aria-label="Field"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
