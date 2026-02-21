"use client";

import React from "react";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { AudioProvider } from "@/components/AudioProvider";
import Navigation from "@/components/Navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <AudioProvider>
        <Navigation />
        <main>{children}</main>
      </AudioProvider>
    </ConvexClientProvider>
  );
}
