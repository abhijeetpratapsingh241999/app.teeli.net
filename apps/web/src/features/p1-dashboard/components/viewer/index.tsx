"use client";

import dynamic from "next/dynamic";
import { ViewerSkeleton } from "../skeleton";
import type { ViewerProps } from "../../types";

// Lazy load the heavy Babylon.js component
const BabylonCanvas = dynamic(
  () => import("./BabylonCanvas").then((mod) => ({ default: mod.BabylonCanvas })),
  {
    ssr: false,
    loading: () => <ViewerSkeleton />,
  }
);

export function Viewer3D(props: ViewerProps) {
  return <BabylonCanvas {...props} />;
}

export { BabylonCanvas } from "./BabylonCanvas";
