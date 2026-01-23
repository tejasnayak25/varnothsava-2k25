"use client";

import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { PageTransitionBar } from "@/components/layout/PageTransitionBar";

export default function ClientLayoutOverlays() {
  return (
    <>
      <LoadingScreen />
      <PageTransitionBar />
    </>
  );
}
