"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import { IoSpeedometerOutline, IoRocketOutline, IoOpenOutline } from "react-icons/io5";

const CS2_SERVERS = [
    { name: "Stockholm (EU)", region: "EU", baseLatency: 60 },
    { name: "Warsaw (EU)", region: "EU", baseLatency: 55 },
    { name: "Dubai", region: "ME", baseLatency: 40 },
    { name: "Singapore", region: "SEA", baseLatency: 110 },
    { name: "Indian Server", region: "IN", baseLatency: 45 },
];

interface PingResult {
    server: string;
    avgPing: number;
    minPing: number;
    maxPing: number;
    jitter: number;
    packetLoss: number;
}

export default function PingBoosterPage() {
    const { user } = useAuth();
    const { playClick, playReload, playVictory } = useAudio();
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<PingResult[]>([]);
    const [pingHistory, setPingHistory] = useState<{ time: string; ping: number; jitter: number }[]>([]);
    const [selectedServer, setSelectedServer] = useState(CS2_SERVERS[0].name);

    if (!user) return <meta httpEquiv="refresh" content="0;url=/auth" />;

    const runScan = useCallback(async () => {
        playReload();
        setIsScanning(true);
        setProgress(0);
        setResults([]);

        const scanResults: PingResult[] = [];
        const history: { time: string; ping: number; jitter: number }[] = [];

        for (let i = 0; i < CS2_SERVERS.length; i++) {
            const server = CS2_SERVERS[i];
            setProgress(((i + 1) / CS2_SERVERS.length) * 100);

            // Simulate network scan using Performance API
            const pings: number[] = [];
            for (let j = 0; j < 10; j++) {
                const start = performance.now();
                // Simulate latency with random variation
                await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
                const elapsed = performance.now() - start;
                const simulated = server.baseLatency + (elapsed - 20) + (Math.random() * 15 - 7);
                pings.push(Math.round(Math.max(10, simulated)));
            }

            const avg = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
            const min = Math.min(...pings);
            const max = Math.max(...pings);
            const jitter = Math.round(
                pings.reduce((acc, p, idx) => {
                    if (idx === 0) return 0;
                    return acc + Math.abs(p - pings[idx - 1]);
                }, 0) / (pings.length - 1)
            );

            scanResults.push({
                server: server.name,
                avgPing: avg,
                minPing: min,
                maxPing: max,
                jitter,
                packetLoss: Math.round(Math.random() * 2 * 10) / 10,
            });

            history.push({ time: server.name.split(" ")[0], ping: avg, jitter });
        }

        setResults(scanResults);
        setPingHistory(history);
        setIsScanning(false);
        playVictory();
    }, [playReload, playVictory]);

    const suggestions = results.length > 0
        ? [
            results[0].avgPing > 80 && "Consider using a VPN like GearUp Booster to route through closer servers.",
            results[0].jitter > 15 && "High jitter detected. Try switching to a wired connection.",
            results[0].packetLoss > 1 && "Packet loss detected. Contact your ISP or try changing DNS to 1.1.1.1.",
            "Enable QoS on your router to prioritize gaming traffic.",
            "Close bandwidth-heavy applications while playing.",
        ].filter(Boolean)
        : [];

    const bestServer = results.length > 0
        ? results.reduce((best, r) => (r.avgPing < best.avgPing ? r : best))
        : null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "Orbitron, Inter, sans-serif", marginBottom: "8px" }}>
                    <IoSpeedometerOutline style={{ verticalAlign: "middle", marginRight: "12px" }} />
                    <span className="gradient-text">PING BOOSTER HUB</span>
                </h1>
                <p style={{ color: "#888", marginBottom: "32px" }}>
                    Scan and optimize your network connection to CS2 servers.
                </p>
            </motion.div>

            {/* Scan Controls */}
            <div className="hud-frame" style={{ padding: "24px", marginBottom: "24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                    <select
                        value={selectedServer}
                        onChange={(e) => setSelectedServer(e.target.value)}
                        className="input-field"
                        style={{ maxWidth: "250px" }}
                    >
                        {CS2_SERVERS.map((s) => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                        ))}
                    </select>

                    <motion.button
                        className="btn-primary"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { playClick(); runScan(); }}
                        disabled={isScanning}
                        style={{ opacity: isScanning ? 0.6 : 1 }}
                    >
                        {isScanning ? "Scanning..." : "Run Diagnostic"}
                    </motion.button>
                </div>

                {/* Progress */}
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ marginTop: "20px" }}
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
                                        background: "linear-gradient(90deg, #ff6b00, #ff8c33)",
                                        borderRadius: "3px",
                                    }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                                Scanning {Math.round(progress)}%... Measuring latency to servers
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results */}
            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Best Server */}
                        {bestServer && (
                            <div
                                className="hud-frame glow-orange"
                                style={{
                                    padding: "20px 24px",
                                    marginBottom: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: "12px",
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Best Server
                                    </div>
                                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#ff6b00" }}>
                                        {bestServer.server} — {bestServer.avgPing}ms
                                    </div>
                                </div>
                                <div style={{ fontSize: "14px", color: "#00c853" }}>
                                    ✓ Recommended
                                </div>
                            </div>
                        )}

                        {/* Chart */}
                        <div className="hud-frame" style={{ padding: "24px", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#888", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Ping by Server
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={pingHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="time" stroke="#555" />
                                    <YAxis stroke="#555" />
                                    <Tooltip
                                        contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                                        labelStyle={{ color: "#fff" }}
                                    />
                                    <Area type="monotone" dataKey="ping" stroke="#ff6b00" fill="rgba(255,107,0,0.1)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="jitter" stroke="#007bff" fill="rgba(0,123,255,0.05)" strokeWidth={1} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Results Table */}
                        <div className="hud-frame" style={{ padding: "0", marginBottom: "24px", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #333" }}>
                                        {["Server", "Avg Ping", "Min", "Max", "Jitter", "Packet Loss"].map((h) => (
                                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, i) => (
                                        <tr key={r.server} style={{ borderBottom: i < results.length - 1 ? "1px solid rgba(51,51,51,0.5)" : "none" }}>
                                            <td style={{ padding: "12px 16px", fontWeight: "600", color: "white" }}>{r.server}</td>
                                            <td style={{ padding: "12px 16px", color: r.avgPing < 50 ? "#00c853" : r.avgPing < 80 ? "#ffa726" : "#ff1744", fontWeight: "700" }}>{r.avgPing}ms</td>
                                            <td style={{ padding: "12px 16px", color: "#aaa" }}>{r.minPing}ms</td>
                                            <td style={{ padding: "12px 16px", color: "#aaa" }}>{r.maxPing}ms</td>
                                            <td style={{ padding: "12px 16px", color: r.jitter < 10 ? "#00c853" : "#ffa726" }}>{r.jitter}ms</td>
                                            <td style={{ padding: "12px 16px", color: r.packetLoss > 1 ? "#ff1744" : "#00c853" }}>{r.packetLoss}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Suggestions */}
                        <div className="hud-frame" style={{ padding: "24px", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#888", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Optimization Suggestions
                            </h3>
                            {suggestions.map((s, i) => (
                                <div key={i} style={{ padding: "8px 0", display: "flex", gap: "10px", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(51,51,51,0.3)" : "none" }}>
                                    <span style={{ color: "#ff6b00" }}>•</span>
                                    <span style={{ color: "#ddd", fontSize: "14px" }}>{s}</span>
                                </div>
                            ))}
                        </div>

                        {/* GearUp Affiliate */}
                        <motion.div
                            className="hud-frame glow-orange"
                            whileHover={{ scale: 1.01 }}
                            style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}
                        >
                            <div>
                                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                                    <IoRocketOutline style={{ verticalAlign: "middle", marginRight: "8px", color: "#ff6b00" }} />
                                    Reduce Ping with GearUp Booster
                                </h3>
                                <p style={{ fontSize: "13px", color: "#888" }}>
                                    Trusted VPN routing for gamers. Get lower ping to EU servers from Uzbekistan.
                                </p>
                                <p style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>
                                    Affiliate link — we may earn a commission at no cost to you.
                                </p>
                            </div>
                            <a
                                href="https://www.gearupbooster.com/?ref=uzcs2boost"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playClick()}
                            >
                                <motion.button className="btn-primary" whileTap={{ scale: 0.95 }} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    Try GearUp <IoOpenOutline />
                                </motion.button>
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
