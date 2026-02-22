"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/AudioProvider";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
    IoClose,
    IoGameControllerOutline,
    IoRocketOutline,
    IoSettingsOutline,
    IoCheckmarkCircle,
} from "react-icons/io5";

interface TrainingConfig {
    mapName: string;
    configName: string;
}

interface ServerProvisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (config: TrainingConfig) => void;
    isProvisioning?: boolean;
}

const MAPS = [
    { id: "de_mirage", name: "Mirage", icon: "🏜️" },
    { id: "de_dust2", name: "Dust II", icon: "🌵" },
    { id: "de_inferno", name: "Inferno", icon: "🔥" },
    { id: "de_nuke", name: "Nuke", icon: "☢️" },
    { id: "de_ancient", name: "Ancient", icon: "🏛️" },
    { id: "de_anubis", name: "Anubis", icon: "🐍" },
];

const CONFIGS = [
    { id: "training.cfg", name: "Training", desc: "Free practice with bots, infinite ammo" },
    { id: "aim_training.cfg", name: "Aim Training", desc: "Focus on aim with high-difficulty bots" },
    { id: "retake.cfg", name: "Retake", desc: "Competitive retake practice" },
];

export default function ServerProvisionModal({
    isOpen,
    onClose,
    onConfirm,
    isProvisioning = false,
}: ServerProvisionModalProps) {
    const t = useTranslations("SkinsPage");
    const locale = useLocale();
    const { playClick, playHit, playVictory } = useAudio();
    const [selectedMap, setSelectedMap] = useState("de_mirage");
    const [selectedConfig, setSelectedConfig] = useState("training.cfg");

    // Query user's loadout
    const userLoadout = useQuery(api.loadout.getUserLoadout);
    const hasLoadout = userLoadout && Array.isArray(userLoadout) && userLoadout.length > 0;

    const handleConfirm = () => {
        playHit();
        onConfirm({ mapName: selectedMap, configName: selectedConfig });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.8)",
                            backdropFilter: "blur(8px)",
                            zIndex: 1000,
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "90%",
                            maxWidth: "520px",
                            maxHeight: "85vh",
                            overflowY: "auto",
                            background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(10,10,10,0.99))",
                            border: "1px solid rgba(235, 75, 75, 0.2)",
                            borderRadius: "16px",
                            padding: "28px",
                            zIndex: 1001,
                            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(235,75,75,0.08)",
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <IoRocketOutline size={22} color="#eb4b4b" />
                                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "white", fontFamily: "Orbitron, Inter, sans-serif" }}>
                                    Deploy Training Server
                                </h2>
                            </div>
                            <button
                                onClick={() => { onClose(); playClick(); }}
                                style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "4px" }}
                            >
                                <IoClose size={22} />
                            </button>
                        </div>

                        {isProvisioning ? (
                            /* ── Provisioning State ──────────────────────────────── */
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    style={{ display: "inline-block", marginBottom: "16px" }}
                                >
                                    <IoRocketOutline size={40} color="#eb4b4b" />
                                </motion.div>
                                <h3 style={{ color: "white", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
                                    Server Booting...
                                </h3>
                                <p style={{ color: "#888", fontSize: "13px" }}>
                                    Setting up your training environment. This may take a moment.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* ── Loadout Preview ─────────────────────────────── */}
                                <div style={{
                                    padding: "14px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "10px",
                                    marginBottom: "20px",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                        <IoGameControllerOutline size={16} color="#eb4b4b" />
                                        <span style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
                                            Your Loadout
                                        </span>
                                    </div>

                                    {hasLoadout ? (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                            {userLoadout!.map((item) => (
                                                <span
                                                    key={item.weaponId}
                                                    style={{
                                                        padding: "4px 10px",
                                                        background: "rgba(235,75,75,0.1)",
                                                        border: "1px solid rgba(235,75,75,0.2)",
                                                        borderRadius: "4px",
                                                        fontSize: "11px",
                                                        color: "#eb4b4b",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {item.weaponId.replace("weapon_", "")}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
                                            No custom loadout saved. Your server will use default CS2 skins.
                                        </p>
                                    )}
                                </div>

                                {/* ── Map Selector ────────────────────────────────── */}
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, display: "block", marginBottom: "10px" }}>
                                        Select Map
                                    </label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                                        {MAPS.map((map) => (
                                            <motion.button
                                                key={map.id}
                                                onClick={() => { setSelectedMap(map.id); playClick(); }}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{
                                                    padding: "12px 8px",
                                                    borderRadius: "8px",
                                                    border: selectedMap === map.id
                                                        ? "2px solid #eb4b4b"
                                                        : "1px solid rgba(255,255,255,0.06)",
                                                    background: selectedMap === map.id
                                                        ? "rgba(235,75,75,0.1)"
                                                        : "rgba(255,255,255,0.02)",
                                                    color: selectedMap === map.id ? "#eb4b4b" : "#ccc",
                                                    cursor: "pointer",
                                                    textAlign: "center",
                                                    fontSize: "12px",
                                                    fontWeight: selectedMap === map.id ? 700 : 400,
                                                }}
                                            >
                                                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{map.icon}</div>
                                                {map.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Config Selector ─────────────────────────────── */}
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, display: "block", marginBottom: "10px" }}>
                                        <IoSettingsOutline style={{ verticalAlign: "middle", marginRight: "6px" }} />
                                        Server Config
                                    </label>
                                    {CONFIGS.map((config) => (
                                        <motion.button
                                            key={config.id}
                                            onClick={() => { setSelectedConfig(config.id); playClick(); }}
                                            whileHover={{ x: 2 }}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px 14px",
                                                marginBottom: "6px",
                                                borderRadius: "8px",
                                                border: selectedConfig === config.id
                                                    ? "2px solid #eb4b4b"
                                                    : "1px solid rgba(255,255,255,0.06)",
                                                background: selectedConfig === config.id
                                                    ? "rgba(235,75,75,0.08)"
                                                    : "rgba(255,255,255,0.02)",
                                                color: "white",
                                                cursor: "pointer",
                                                textAlign: "left",
                                            }}
                                        >
                                            <div style={{ fontSize: "13px", fontWeight: 600 }}>{config.name}</div>
                                            <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{config.desc}</div>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* ── Deploy Button ───────────────────────────────── */}
                                <motion.button
                                    onClick={handleConfirm}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        width: "100%",
                                        padding: "16px",
                                        borderRadius: "10px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: 800,
                                        fontSize: "15px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1.5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        background: "linear-gradient(135deg, #eb4b4b, #ff8a00)",
                                        color: "white",
                                        fontFamily: "Orbitron, Inter, sans-serif",
                                    }}
                                >
                                    <IoRocketOutline size={20} />
                                    {hasLoadout ? "Deploy with Saved Skins" : "Deploy with Defaults"}
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
