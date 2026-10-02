import type { FolderSuggestion } from "./types";

const RULES: { label: string; keywords: string[] }[] = [
  {
    label: "Wetland / water",
    keywords: [
      "wetland",
      "marsh",
      "riparian",
      "creek",
      "stream",
      "culvert",
      "sediment",
      "cattail",
      "riprap",
      "bank",
      "drawdown",
    ],
  },
  {
    label: "Vegetation survey",
    keywords: ["vegetation", "invasive", "canopy", "shrub", "habitat", "tree"],
  },
  {
    label: "Building envelope",
    keywords: [
      "facade",
      "elevation",
      "window",
      "cladding",
      "roof",
      "cornice",
      "crack",
      "lintel",
    ],
  },
  {
    label: "Safety inspection",
    keywords: ["hazard", "safety", "guardrail", "osha", "ppe", "tripping"],
  },
  {
    label: "Site civil",
    keywords: ["asphalt", "pavement", "curb", "sidewalk", "grading", "stake"],
  },
];

function hasWord(text: string, word: string) {
  return new RegExp(`\\b${word}\\b`, "i").test(text);
}

function matchProject(
  projects: { id: string; name: string }[],
  label: string,
  keywords: string[],
  hits: string[],
) {
  const needles = [...keywords, ...label.toLowerCase().split(/[^a-z0-9]+/)].filter(
    (token) => token.length >= 5,
  );

  let best: { id: string; name: string; score: number } | null = null;
  for (const project of projects) {
    const name = project.name.toLowerCase();
    let score = 0;
    for (const token of needles) {
      if (!name.includes(token)) continue;
      score += hits.includes(token) ? token.length * 2 : token.length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id: project.id, name: project.name, score };
    }
  }
  return best;
}

export function suggestFolder(
  note: string,
  projects: { id: string; name: string }[],
): FolderSuggestion | null {
  const text = note.trim().toLowerCase();
  if (text.length < 3) return null;

  let best: { label: string; hits: string[] } | null = null;
  for (const rule of RULES) {
    const hits = rule.keywords.filter((keyword) => hasWord(text, keyword));
    if (hits.length === 0) continue;
    if (!best || hits.length > best.hits.length) {
      best = { label: rule.label, hits };
    }
  }
  if (!best) return null;

  const matched = matchProject(
    projects,
    best.label,
    RULES.find((rule) => rule.label === best.label)?.keywords ?? [],
    best.hits,
  );
  return {
    label: matched?.name ?? best.label,
    matchedProjectId: matched?.id ?? null,
    reason: `Matched ${best.hits.slice(0, 3).join(", ")}`,
  };
}
