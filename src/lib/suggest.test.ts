import assert from "node:assert/strict";
import test from "node:test";
import { suggestFolder } from "./suggest";

const projects = [
  { id: "wet", name: "Riverside Wetland Survey" },
  { id: "facade", name: "Oak Street Facade Check" },
];

test("wetland notes match the sample wetland project", () => {
  const suggestion = suggestFolder(
    "North bank, sparse cattail cover after drawdown.",
    projects,
  );
  assert.equal(suggestion?.matchedProjectId, "wet");
  assert.equal(suggestion?.label, "Riverside Wetland Survey");
});

test("facade notes match the building project", () => {
  const suggestion = suggestFolder(
    "West elevation, hairline crack above the second-floor window.",
    projects,
  );
  assert.equal(suggestion?.matchedProjectId, "facade");
});

test("safety language suggests a new folder when none exists", () => {
  const suggestion = suggestFolder("Missing guardrail at the stair opening.", []);
  assert.equal(suggestion?.label, "Safety inspection");
  assert.equal(suggestion?.matchedProjectId, null);
});

test("short notes do not suggest a folder", () => {
  assert.equal(suggestFolder("ok", projects), null);
});
