import type { Metadata } from "next";
import { GalleryScreen } from "@/components/field/gallery-screen";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function Page() {
  return <GalleryScreen />;
}
