"use client";

import React from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  accentColor = "#ff6b00",
  onClick,
  children,
}: DashboardCardProps) {
  return (
    <motion.div
      className="hud-frame"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{
        padding: "24px",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          width: "12px",
          height: "12px",
          borderTop: `2px solid ${accentColor}`,
          borderRight: `2px solid ${accentColor}`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "8px",
          width: "12px",
          height: "12px",
          borderBottom: `2px solid ${accentColor}`,
          borderLeft: `2px solid ${accentColor}`,
          opacity: 0.5,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#888",
              marginBottom: "8px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: accentColor,
              lineHeight: 1,
              marginBottom: "4px",
            }}
          >
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              opacity: 0.3,
              color: accentColor,
              fontSize: "40px",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {children && <div style={{ marginTop: "16px" }}>{children}</div>}
    </motion.div>
  );
}
