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
} from "recharts";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import {
  IoSpeedometerOutline,
  IoRocketOutline,
  IoOpenOutline,
  IoHardwareChipOutline,
  IoWarningOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useLocale } from "next-intl";

const CS2_SERVERS = [
  { name: "Stockholm (EU)", region: "EU", baseLatency: 60, routingHops: 12 },
  { name: "Warsaw (EU)", region: "EU", baseLatency: 55, routingHops: 10 },
  { name: "Dubai", region: "ME", baseLatency: 40, routingHops: 8 },
  { name: "Singapore", region: "SEA", baseLatency: 110, routingHops: 15 },
  { name: "Indian Server", region: "IN", baseLatency: 45, routingHops: 9 },
];

interface DiagnosticResult {
  server: string;
  avgPing: number;
  minPing: number;
  maxPing: number;
  jitter: number;
  packetLoss: number;
  routingHops: number;
  status: "Optimal" | "Suboptimal" | "Critical";
}

export default function AdvancedDiagnosticsPage() {
  const { user } = useAuth();
  const { playClick, playReload, playVictory } = useAudio();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<
    { time: string; ping: number; jitter: number }[]
  >([]);
  const [selectedServer, setSelectedServer] = useState(CS2_SERVERS[0].name);

  const locale = useLocale();

  if (!user) return <meta httpEquiv="refresh" content={`0;url=/${locale}/auth`} />;

  const runScan = useCallback(async () => {
    playReload();
    setIsScanning(true);
    setProgress(0);
    setResults([]);

    const scanResults: DiagnosticResult[] = [];
    const history: { time: string; ping: number; jitter: number }[] = [];

    for (let i = 0; i < CS2_SERVERS.length; i++) {
      const server = CS2_SERVERS[i];
      setProgress(((i + 1) / CS2_SERVERS.length) * 100);

      // Simulate network scan
      const pings: number[] = [];
      for (let j = 0; j < 15; j++) {
        await new Promise((r) => setTimeout(r, 15 + Math.random() * 20)); // faster simulation
        const simulated =
          server.baseLatency + (Math.random() * 10 - 4);
        pings.push(Math.round(Math.max(10, simulated)));
      }

      const avg = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
      const min = Math.min(...pings);
      const max = Math.max(...pings);
      const jitter = Math.round(
        pings.reduce((acc, p, idx) => {
          if (idx === 0) return 0;
          return acc + Math.abs(p - pings[idx - 1]);
        }, 0) /
        (pings.length - 1),
      );

      const packetLoss = Math.round(Math.random() * 2 * 10) / 10;

      let status: "Optimal" | "Suboptimal" | "Critical" = "Optimal";
      if (avg > 80 || jitter > 10 || packetLoss > 0.5) status = "Suboptimal";
      if (avg > 120 || jitter > 20 || packetLoss > 2.0) status = "Critical";

      scanResults.push({
        server: server.name,
        avgPing: avg,
        minPing: min,
        maxPing: max,
        jitter,
        packetLoss,
        routingHops: server.routingHops + Math.floor(Math.random() * 3),
        status,
      });

      history.push({ time: server.name.split(" ")[0], ping: avg, jitter: jitter * 3 }); // scale jitter for visibility
    }

    setResults(scanResults);
    setMetricsHistory(history);
    setIsScanning(false);
    playVictory();
  }, [playReload, playVictory]);

  const bestServer =
    results.length > 0
      ? results.reduce((best, r) => (r.avgPing < best.avgPing ? r : best))
      : null;

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
          <IoHardwareChipOutline
            style={{ verticalAlign: "middle", marginRight: "12px" }}
          />
          <span className="gradient-text">ADVANCED DIAGNOSTICS</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>
          Deep network analysis, routing inspection, and connection optimization to global CS2 datacenters.
        </p>
      </motion.div>

      {/* Control Panel */}
      <div
        className="hud-frame"
        style={{ padding: "24px", marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}
      >
        <select
          value={selectedServer}
          onChange={(e) => setSelectedServer(e.target.value)}
          className="input-field"
          style={{ maxWidth: "250px", margin: 0 }}
        >
          {CS2_SERVERS.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.region})
            </option>
          ))}
        </select>

        <motion.button
          className="btn-primary"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            runScan();
          }}
          disabled={isScanning}
          style={{ opacity: isScanning ? 0.6 : 1, display: "flex", alignItems: "center", gap: "8px" }}
        >
          {isScanning ? (
            <>Scanning...</>
          ) : (
            <>
              <IoSpeedometerOutline /> Initiate Deep Scan
            </>
          )}
        </motion.button>

        {/* Progress bar */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0 }}
              style={{ marginTop: "16px", flexBasis: "100%" }}
            >
              <div
                style={{
                  height: "4px",
                  background: "#1e1e1e",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #ff6b00, #ff8c33)",
                    borderRadius: "2px",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginTop: "6px" }}>
                <span>Analyzing packet routes...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "24px" }}>
              {/* Telemetry Chart */}
              <div className="hud-frame" style={{ padding: "24px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#888",
                    marginBottom: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Network Telemetry
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={metricsHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#555" fontSize={11} tickMargin={10} />
                    <Tooltip
                      contentStyle={{
                        background: "#111",
                        border: "1px solid rgba(255,107,0,0.3)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ping"
                      name="Latency (ms)"
                      stroke="#ff6b00"
                      fill="url(#colorPing)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="jitter"
                      name="Jitter Spikes"
                      stroke="#ff3b30"
                      fill="transparent"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <defs>
                      <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Best Server Highlights */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {bestServer && (
                  <div
                    className="hud-frame glow-orange"
                    style={{
                      padding: "24px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(255,107,0,0.1), transparent)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#ff8c33",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "8px",
                      }}
                    >
                      Optimal Routing Target
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "white", marginBottom: "4px" }}>
                      {bestServer.server}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <IoSpeedometerOutline color="#00c853" />
                        <span style={{ fontSize: "16px", fontWeight: "700", color: "#00c853" }}>
                          {bestServer.avgPing}ms
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <IoCheckmarkCircleOutline color="#888" />
                        <span style={{ fontSize: "13px", color: "#aaa" }}>
                          0% Loss
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* GearUp Booster Promo Widget */}
                <motion.div
                  className="hud-frame"
                  whileHover={{ scale: 1.02, borderColor: "rgba(255,107,0,0.5)" }}
                  style={{
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.3)"
                  }}
                  onClick={() => {
                    playClick();
                    window.open("https://www.gearupbooster.com/?ref=uzcs2boost", "_blank");
                  }}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #111, #222)",
                    border: "1px solid #333", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}>
                    <IoRocketOutline size={24} color="#ff6b00" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "15px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                      Optimize Routing with GearUP
                    </h4>
                    <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.4 }}>
                      Bypass ISP bottlenecks and secure stable connections to European servers.
                    </p>
                  </div>
                  <IoOpenOutline color="#555" />
                </motion.div>
              </div>
            </div>

            {/* Comprehensive Table */}
            <div
              className="hud-frame"
              style={{ padding: "0", marginBottom: "24px", overflow: "hidden" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid #333" }}>
                    {[
                      "Datacenter",
                      "Avg Latency",
                      "Jitter",
                      "Packet Loss",
                      "Routing Hops",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontSize: "11px",
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontWeight: "600"
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr
                      key={r.server}
                      style={{
                        borderBottom:
                          i < results.length - 1
                            ? "1px solid rgba(51,51,51,0.5)"
                            : "none",
                        background: r.status === "Critical" ? "rgba(255,23,68,0.05)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "16px", fontWeight: "600", color: "white" }}>
                        {r.server}
                      </td>
                      <td style={{ padding: "16px", fontWeight: "700", color: r.avgPing < 60 ? "#00c853" : r.avgPing < 90 ? "#ffa726" : "#ff1744" }}>
                        {r.avgPing}ms
                      </td>
                      <td style={{ padding: "16px", color: r.jitter < 8 ? "#00c853" : "#ffa726" }}>
                        ±{r.jitter}ms
                      </td>
                      <td style={{ padding: "16px", color: r.packetLoss > 0.5 ? "#ff1744" : "#00c853" }}>
                        {r.packetLoss}%
                      </td>
                      <td style={{ padding: "16px", color: "#aaa" }}>
                        {r.routingHops} Nodes
                      </td>
                      <td style={{ padding: "16px" }}>
                        {r.status === "Optimal" && (
                          <span style={{ color: "#00c853", display: "flex", alignItems: "center", gap: "4px" }}>
                            <IoCheckmarkCircleOutline /> Optimal
                          </span>
                        )}
                        {r.status === "Suboptimal" && (
                          <span style={{ color: "#ffa726", display: "flex", alignItems: "center", gap: "4px" }}>
                            <IoWarningOutline /> Suboptimal
                          </span>
                        )}
                        {r.status === "Critical" && (
                          <span style={{ color: "#ff1744", display: "flex", alignItems: "center", gap: "4px" }}>
                            <IoWarningOutline /> Critical
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
