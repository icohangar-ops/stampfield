import assert from "node:assert/strict";
import test from "node:test";
import { escapeCsv, toCsv } from "./csv";

test("escapes commas, quotes, and newlines", () => {
  assert.equal(escapeCsv('north bank, "wet"'), '"north bank, ""wet"""');
  assert.equal(escapeCsv("line\nbreak"), '"line\nbreak"');
  assert.equal(escapeCsv(null), "");
});

test("builds a header and rows", () => {
  const csv = toCsv(["note", "latitude"], [{ note: "ok", latitude: 47.1 }]);
  assert.equal(csv, "note,latitude\r\nok,47.1");
});
