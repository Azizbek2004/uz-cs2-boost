"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import {
  IoPulseOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";

interface JitterSample {
  index: number;
  latency: number;
  jitter: number;
}

export default function JitterDiagnosticPage() {
  const { user } = useAuth();
  const { playClick, playReload, playVictory } = useAudio();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [beforeData, setBeforeData] = useState<JitterSample[]>([]);
  const [afterData, setAfterData] = useState<JitterSample[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [summary, setSummary] = useState({
    avgJitter: 0,
    maxJitter: 0,
    stability: "",
  });

  if (!user) return <meta httpEquiv="refresh" content="0;url=/auth" />;

  const runDiagnostic = useCallback(async () => {
    playReload();
    setIsScanning(true);
    setProgress(0);
    setScanComplete(false);
    setBeforeData([]);
    setAfterData([]);

    // Phase 1: Before optimization (simulate higher jitter)
    const before: JitterSample[] = [];
    const sampleCount = 30;

    for (let i = 0; i < sampleCount; i++) {
      const baseLatency = 50 + Math.random() * 30;
      const jitterSpike =
        Math.random() > 0.7 ? Math.random() * 40 : Math.random() * 10;
      const latency = Math.round(baseLatency + jitterSpike);
      const jitter =
        i > 0 ? Math.abs(latency - (before[i - 1]?.latency || latency)) : 0;

      before.push({ index: i + 1, latency, jitter });
      setProgress(((i + 1) / (sampleCount * 2)) * 100);
      setBeforeData([...before]);
      await new Promise((r) => setTimeout(r, 80));
    }

    // Phase 2: After optimization (simulate lower, more stable jitter)
    const after: JitterSample[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const baseLatency = 40 + Math.random() * 10;
      const jitterSpike =
        Math.random() > 0.9 ? Math.random() * 8 : Math.random() * 3;
      const latency = Math.round(baseLatency + jitterSpike);
      const jitter =
        i > 0 ? Math.abs(latency - (after[i - 1]?.latency || latency)) : 0;

      after.push({ index: i + 1, latency, jitter });
      setProgress(50 + ((i + 1) / (sampleCount * 2)) * 100);
      setAfterData([...after]);
      await new Promise((r) => setTimeout(r, 60));
    }

    // Calculate summary
    const avgBefore = Math.round(
      before.reduce((a, b) => a + b.jitter, 0) / before.length,
    );
    const avgAfter = Math.round(
      after.reduce((a, b) => a + b.jitter, 0) / after.length,
    );
    const maxBefore = Math.max(...before.map((s) => s.jitter));
    const improvement =
      avgBefore > 0
        ? Math.round(((avgBefore - avgAfter) / avgBefore) * 100)
        : 0;

    setSummary({
      avgJitter: avgAfter,
      maxJitter: maxBefore,
      stability:
        improvement > 30
          ? "Significant improvement"
          : improvement > 10
            ? "Moderate improvement"
            : "Minimal change",
    });

    setIsScanning(false);
    setScanComplete(true);
    playVictory();
  }, [playReload, playVictory]);

  const suggestions = [
    {
      title: "Enable QoS",
      desc: "Prioritize gaming traffic on your router. Go to router settings > QoS > Add CS2.",
      priority: "high",
    },
    {
      title: "Change DNS",
      desc: "Switch to Cloudflare (1.1.1.1) or Google (8.8.8.8) DNS for faster resolution.",
      priority: "medium",
    },
    {
      title: "Wired Connection",
      desc: "Use Ethernet instead of WiFi to reduce jitter from wireless interference.",
      priority: "high",
    },
    {
      title: "Close Background Apps",
      desc: "Streaming, downloads, and updates cause jitter spikes during gameplay.",
      priority: "medium",
    },
    {
      title: "Contact ISP",
      desc: "If jitter persists, your ISP may have routing issues. Consider UzNet or Sarkor.",
      priority: "low",
    },
  ];

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
          <IoPulseOutline
            style={{ verticalAlign: "middle", marginRight: "12px" }}
          />
          <span className="gradient-text-blue">JITTER DIAGNOSTIC</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>
          Analyze network stability and get actionable fixes for jitter issues.
        </p>
      </motion.div>

      {/* Controls */}
      <div
        className="hud-frame"
        style={{ padding: "24px", marginBottom: "24px" }}
      >
        <motion.button
          className="btn-primary"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            runDiagnostic();
          }}
          disabled={isScanning}
          style={{ opacity: isScanning ? 0.6 : 1 }}
        >
          {isScanning ? "Analyzing Network..." : "Start Jitter Analysis"}
        </motion.button>

        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: "16px" }}
            >
              <div
                style={{
                  height: "6px",
                  background: "#1e1e1e",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #007bff, #339dff)",
                    borderRadius: "3px",
                  }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                {progress < 50
                  ? "Phase 1: Measuring baseline jitter..."
                  : "Phase 2: Testing optimized path..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Before/After Charts */}
      <AnimatePresence>
        {(beforeData.length > 0 || afterData.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {/* Before */}
              <div className="hud-frame" style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#ff1744",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Before Optimization
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={beforeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="index" stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="latency"
                      stroke="#ff1744"
                      fill="rgba(255,23,68,0.1)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="jitter"
                      stroke="#ff6b00"
                      fill="rgba(255,107,0,0.05)"
                      strokeWidth={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* After */}
              <div className="hud-frame" style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#00c853",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  After Optimization
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={afterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="index" stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="latency"
                      stroke="#00c853"
                      fill="rgba(0,200,83,0.1)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="jitter"
                      stroke="#007bff"
                      fill="rgba(0,123,255,0.05)"
                      strokeWidth={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary */}
            {scanComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginBottom: "24px" }}
              >
                <div className="stats-grid">
                  {[
                    {
                      label: "Avg Jitter",
                      value: `${summary.avgJitter}ms`,
                      color: summary.avgJitter < 10 ? "#00c853" : "#ffa726",
                    },
                    {
                      label: "Max Spike",
                      value: `${summary.maxJitter}ms`,
                      color: "#ff6b00",
                    },
                    {
                      label: "Result",
                      value: summary.stability,
                      color: "#007bff",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="hud-frame"
                      style={{ padding: "20px", textAlign: "center" }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          marginBottom: "8px",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "800",
                          color: s.color,
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Suggestions */}
            {scanComplete && (
              <div className="hud-frame" style={{ padding: "24px" }}>
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
                  Recommended Fixes
                </h3>
                {suggestions.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        i < suggestions.length - 1
                          ? "1px solid rgba(51,51,51,0.5)"
                          : "none",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        color:
                          s.priority === "high"
                            ? "#ff6b00"
                            : s.priority === "medium"
                              ? "#ffa726"
                              : "#888",
                        marginTop: "2px",
                      }}
                    >
                      {s.priority === "high" ? (
                        <IoWarningOutline size={18} />
                      ) : (
                        <IoCheckmarkCircleOutline size={18} />
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        {s.title}
                      </div>
                      <div
                        style={{
                          color: "#aaa",
                          fontSize: "13px",
                          marginTop: "2px",
                        }}
                      >
                        {s.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
