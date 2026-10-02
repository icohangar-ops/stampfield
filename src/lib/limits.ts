import { LITE_EXPORT_LIMIT, LITE_PROJECT_LIMIT } from "./constants";
import type { Project, Settings } from "./types";

export function userProjectCount(projects: Project[]) {
  return projects.filter((project) => !project.sample).length;
}

export function canCreateProject(projects: Project[], settings: Settings) {
  if (settings.proUnlocked) return true;
  return userProjectCount(projects) < LITE_PROJECT_LIMIT;
}

export function projectsRemaining(projects: Project[], settings: Settings) {
  if (settings.proUnlocked) return Number.POSITIVE_INFINITY;
  return Math.max(0, LITE_PROJECT_LIMIT - userProjectCount(projects));
}

export function canExport(settings: Settings) {
  if (settings.proUnlocked) return true;
  return settings.exportCount < LITE_EXPORT_LIMIT;
}

export function exportsRemaining(settings: Settings) {
  if (settings.proUnlocked) return Number.POSITIVE_INFINITY;
  return Math.max(0, LITE_EXPORT_LIMIT - settings.exportCount);
}

export function formatRemaining(value: number) {
  return value === Number.POSITIVE_INFINITY ? "Unlimited" : String(value);
}
