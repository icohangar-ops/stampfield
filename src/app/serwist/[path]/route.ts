import { createSerwistRoute } from "@serwist/turbopack";
import { spawnSync } from "node:child_process";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout.trim() ||
  "stampfield";

const pages = ["/~offline", "/", "/field", "/field/capture", "/field/gallery", "/field/settings"];

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: pages.map((url) => ({ url, revision })),
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
  });
