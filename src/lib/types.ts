export type GpsSource = "device" | "manual" | "unavailable";

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sample: boolean;
};

export type Capture = {
  id: string;
  projectId: string;
  createdAt: string;
  note: string;
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  gpsSource: GpsSource;
  mimeType: string;
  width: number;
  height: number;
  byteSize: number;
  sample: boolean;
};

export type Settings = {
  id: string;
  seeded: boolean;
  proUnlocked: boolean;
  exportCount: number;
};

export type FolderSuggestion = {
  label: string;
  reason: string;
  matchedProjectId: string | null;
};

export type NewCaptureInput = {
  projectId: string;
  note: string;
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  gpsSource: GpsSource;
  blob: Blob;
  width: number;
  height: number;
};
