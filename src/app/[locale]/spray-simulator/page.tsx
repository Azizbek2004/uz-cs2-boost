"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import SprayCanvas from "@/components/SprayCanvas";
import { IoGameControllerOutline, IoTrophyOutline } from "react-icons/io5";

export default function SpraySimulatorPage() {
  const { user } = useAuth();
  const [bestScore, setBestScore] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  if (!user) return <meta httpEquiv="refresh" content="0;url=/auth" />;

  const handleScoreUpdate = (score: number, accuracy: number) => {
    setSessionCount((c) => c + 1);
    if (score > bestScore) {
      setBestScore(score);
    }
    if (accuracy > bestAccuracy) {
      setBestAccuracy(accuracy);
    }
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            fontFamily: "Orbitron, Inter, sans-serif",
            marginBottom: "8px",
          }}
        >
          <IoGameControllerOutline
            style={{ verticalAlign: "middle", marginRight: "12px" }}
          />
          <span className="gradient-text">SPRAY SIMULATOR</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "24px" }}>
          Master CS2 spray patterns. Click where each bullet should land to
          counter the recoil.
        </p>
      </motion.div>

      {/* Stats Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Sessions", value: sessionCount, color: "#007bff" },
          { label: "Best Score", value: bestScore, color: "#ff6b00" },
          {
            label: "Best Accuracy",
            value: `${bestAccuracy}%`,
            color: "#00c853",
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="hud-frame"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "14px 20px",
              flex: "1 1 120px",
              minWidth: "120px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: "22px", fontWeight: "800", color: s.color }}
            >
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spray Canvas */}
      <div className="hud-frame" style={{ padding: "24px" }}>
        <SprayCanvas onScoreUpdate={handleScoreUpdate} />
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hud-frame"
        style={{ padding: "24px", marginTop: "24px" }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#888",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <IoTrophyOutline
            style={{
              verticalAlign: "middle",
              marginRight: "8px",
              color: "#ffd700",
            }}
          />
          Spray Tips
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              weapon: "AK-47",
              tip: "Pull down sharply for the first 10 bullets, then sweep left-right in a T-pattern.",
              lore: '"The most iconic spray in CS history — master this, master the game."',
            },
            {
              weapon: "M4A4",
              tip: "Mostly vertical pull with slight left bias. Easier than AK but less damage.",
              lore: '"Consistent and reliable — the CT\'s best friend."',
            },
            {
              weapon: "M4A1-S",
              tip: "Tight pattern, less bullets. Focus on short bursts for optimal accuracy.",
              lore: '"Silence is deadly. 25 rounds, zero sound."',
            },
          ].map((t) => (
            <div
              key={t.weapon}
              style={{
                padding: "12px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  color: "#ff6b00",
                  marginBottom: "6px",
                }}
              >
                {t.weapon}
              </div>
              <div
                style={{ fontSize: "13px", color: "#ddd", marginBottom: "6px" }}
              >
                {t.tip}
              </div>
              <div
                style={{ fontSize: "12px", color: "#555", fontStyle: "italic" }}
              >
                {t.lore}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
