"use client";

import React from "react";

interface VideoBackgroundProps {
    opacity?: number;
    children?: React.ReactNode;
}

export default function VideoBackground({ opacity = 0.12, children }: VideoBackgroundProps) {
    return (
        <div className="video-bg-container" style={{ position: "relative", minHeight: "100%" }}>
            {/* Animated gradient background as replacement for video */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
            radial-gradient(ellipse at 20% 50%, rgba(255, 107, 0, ${opacity * 0.5}) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(0, 123, 255, ${opacity * 0.3}) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 90%, rgba(255, 107, 0, ${opacity * 0.2}) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)
          `,
                    zIndex: 0,
                    overflow: "hidden",
                }}
            >
                {/* Animated scan line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent)",
                        animation: "scan-line 4s ease-in-out infinite",
                        zIndex: 1,
                    }}
                />
                {/* Grid overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
                        backgroundSize: "50px 50px",
                        zIndex: 1,
                    }}
                />
            </div>

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
        </div>
    );
}
