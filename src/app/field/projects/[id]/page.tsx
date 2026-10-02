import type { Metadata } from "next";
import { ProjectScreen } from "@/components/field/project-screen";

export const metadata: Metadata = {
  title: "Project",
};

export default function Page() {
  return <ProjectScreen />;
}
