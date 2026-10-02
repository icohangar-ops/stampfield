import type { ReactNode } from "react";
import { FieldProvider } from "@/lib/field-context";
import { AppShell } from "@/components/field/app-shell";

export default function FieldLayout({ children }: { children: ReactNode }) {
  return (
    <FieldProvider>
      <AppShell>{children}</AppShell>
    </FieldProvider>
  );
}
