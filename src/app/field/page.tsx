import type { Metadata } from "next";
import { ProjectsScreen } from "@/components/field/projects-screen";

export const metadata: Metadata = {
  title: "Projects",
};

export default function Page() {
  return <ProjectsScreen />;
}
