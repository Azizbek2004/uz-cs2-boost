"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import DashboardCard from "@/components/DashboardCard";
import VideoBackground from "@/components/VideoBackground";
import {
    IoSpeedometerOutline,
    IoPulseOutline,
    IoGameControllerOutline,
    IoPeopleOutline,
    IoTrophyOutline,
    IoRocketOutline,
} from "react-icons/io5";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <meta httpEquiv="refresh" content="0;url=/auth" />;
    }

    return (
        <VideoBackground opacity={0.06}>
            <div className="page-container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: "32px" }}
                >
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            fontFamily: "Orbitron, Inter, sans-serif",
                            marginBottom: "8px",
                        }}
                    >
                        Welcome back, <span className="gradient-text">{user.name}</span>
                    </h1>
                    <p style={{ color: "#888", fontSize: "14px" }}>
                        Your competitive dashboard — track performance and optimize your game.
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="dashboard-grid" style={{ marginBottom: "32px" }}>
                    <Link href="/ping-booster" style={{ textDecoration: "none" }}>
                        <DashboardCard
                            title="Current Ping"
                            value="45ms"
                            subtitle="Last scan: 2 hours ago"
                            icon={<IoSpeedometerOutline />}
                            accentColor="#ff6b00"
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: "#00c853",
                                        animation: "pulse-glow 2s infinite",
                                    }}
                                />
                                <span style={{ fontSize: "12px", color: "#00c853" }}>Good connection</span>
                            </div>
                        </DashboardCard>
                    </Link>

                    <Link href="/jitter-diagnostic" style={{ textDecoration: "none" }}>
                        <DashboardCard
                            title="Jitter"
                            value="8ms"
                            subtitle="Stable — below threshold"
                            icon={<IoPulseOutline />}
                            accentColor="#007bff"
                        />
                    </Link>

                    <Link href="/spray-simulator" style={{ textDecoration: "none" }}>
                        <DashboardCard
                            title="Spray Score"
                            value="78%"
                            subtitle="AK-47 • Best session today"
                            icon={<IoGameControllerOutline />}
                            accentColor="#00c853"
                        />
                    </Link>

                    <Link href="/community" style={{ textDecoration: "none" }}>
                        <DashboardCard
                            title="FACEIT Elo"
                            value={user.faceitElo || "1,450"}
                            subtitle={`Level ${user.faceitLevel || 5} • ${user.faceitNickname || "Not linked"}`}
                            icon={<IoTrophyOutline />}
                            accentColor="#ffd700"
                        />
                    </Link>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2
                        style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            marginBottom: "16px",
                            color: "#888",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Quick Actions
                    </h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "12px",
                        }}
                    >
                        {[
                            { href: "/ping-booster", label: "Run Ping Scan", icon: <IoRocketOutline size={20} />, color: "#ff6b00" },
                            { href: "/spray-simulator", label: "Practice Spray", icon: <IoGameControllerOutline size={20} />, color: "#00c853" },
                            { href: "/community", label: "Find Scrim", icon: <IoPeopleOutline size={20} />, color: "#007bff" },
                            { href: "/jitter-diagnostic", label: "Check Jitter", icon: <IoPulseOutline size={20} />, color: "#ffd700" },
                        ].map((action, i) => (
                            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
                                <motion.div
                                    className="hud-frame"
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    style={{
                                        padding: "16px 20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ color: action.color }}>{action.icon}</div>
                                    <span style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>
                                        {action.label}
                                    </span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ marginTop: "32px" }}
                >
                    <h2
                        style={{
                            fontWeight: "700",
                            marginBottom: "16px",
                            color: "#888",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontSize: "13px",
                        }}
                    >
                        Recent Activity
                    </h2>
                    <div className="hud-frame" style={{ padding: "0" }}>
                        {[
                            { text: "Ping scan completed — 42ms avg", time: "2h ago", color: "#00c853" },
                            { text: "AK-47 spray session — Score: 2,340", time: "5h ago", color: "#ff6b00" },
                            { text: "Joined scrim: Dust2 5v5", time: "Yesterday", color: "#007bff" },
                            { text: "FACEIT Elo updated: +25", time: "2 days ago", color: "#ffd700" },
                        ].map((activity, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "14px 20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: i < 3 ? "1px solid rgba(51,51,51,0.5)" : "none",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div
                                        style={{
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            background: activity.color,
                                        }}
                                    />
                                    <span style={{ fontSize: "14px", color: "#ddd" }}>{activity.text}</span>
                                </div>
                                <span style={{ fontSize: "12px", color: "#555" }}>{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </VideoBackground>
    );
}
