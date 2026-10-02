import assert from "node:assert/strict";
import test from "node:test";
import { LITE_EXPORT_LIMIT, LITE_PROJECT_LIMIT } from "./constants";
import { canCreateProject, canExport, userProjectCount } from "./limits";
import type { Project, Settings } from "./types";

const lite: Settings = {
  id: "settings",
  seeded: true,
  proUnlocked: false,
  exportCount: 0,
};

function project(sample: boolean, id: string): Project {
  return {
    id,
    name: id,
    createdAt: "2026-09-18T15:00:00.000Z",
    updatedAt: "2026-09-18T15:00:00.000Z",
    sample,
  };
}

test("sample folders do not consume the Lite project quota", () => {
  const projects = [
    project(true, "sample"),
    project(false, "one"),
    project(false, "two"),
  ];
  assert.equal(userProjectCount(projects), 2);
  assert.equal(canCreateProject(projects, lite), false);
  assert.equal(LITE_PROJECT_LIMIT, 2);
});

test("Pro removes the export cap", () => {
  assert.equal(canExport({ ...lite, exportCount: LITE_EXPORT_LIMIT }), false);
  assert.equal(
    canExport({ ...lite, proUnlocked: true, exportCount: 40 }),
    true,
  );
});
