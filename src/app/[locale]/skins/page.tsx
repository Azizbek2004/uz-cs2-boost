"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoBackground from "@/components/VideoBackground";
import { useAudio } from "@/components/AudioProvider";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import {
    IoSearchOutline,
    IoFilterOutline,
    IoChevronForward,
    IoClose,
    IoSaveOutline,
    IoTrashOutline,
    IoCheckmarkCircle,
} from "react-icons/io5";
import {
    GiAk47,
    GiPistolGun,
    GiCrosshair,
    GiSwitchblade,
    GiGloves,
    GiShotgunRounds,
    GiMachineGunMagazine,
} from "react-icons/gi";

// ── Weapon categories and their weaponIds ─────────────────────────────────
const weaponCategories = [
    {
        key: "all",
        icon: IoFilterOutline,
        weapons: [],
    },
    {
        key: "rifles",
        icon: GiAk47,
        weapons: [
            "weapon_ak47", "weapon_m4a1", "weapon_m4a1_silencer",
            "weapon_aug", "weapon_sg556", "weapon_famas", "weapon_galilar",
        ],
    },
    {
        key: "snipers",
        icon: GiCrosshair,
        weapons: ["weapon_awp", "weapon_ssg08", "weapon_scar20", "weapon_g3sg1"],
    },
    {
        key: "pistols",
        icon: GiPistolGun,
        weapons: [
            "weapon_glock", "weapon_usp_silencer", "weapon_p250",
            "weapon_deagle", "weapon_fiveseven", "weapon_tec9",
            "weapon_cz75auto", "weapon_elite", "weapon_revolver",
        ],
    },
    {
        key: "smgs",
        icon: GiMachineGunMagazine,
        weapons: [
            "weapon_mp9", "weapon_mac10", "weapon_mp7",
            "weapon_ump45", "weapon_p90", "weapon_bizon", "weapon_mp5sd",
        ],
    },
    {
        key: "heavy",
        icon: GiShotgunRounds,
        weapons: [
            "weapon_nova", "weapon_xm1014", "weapon_mag7",
            "weapon_sawedoff", "weapon_m249", "weapon_negev",
        ],
    },
    {
        key: "knives",
        icon: GiSwitchblade,
        weapons: [
            "weapon_knife_karambit", "weapon_knife_butterfly",
            "weapon_knife_m9_bayonet", "weapon_bayonet",
            "weapon_knife_flip", "weapon_knife_gut",
            "weapon_knife_tactical", "weapon_knife_falchion",
            "weapon_knife_survival_bowie", "weapon_knife_ursus",
            "weapon_knife_stiletto", "weapon_knife_widowmaker",
            "weapon_knife_skeleton",
        ],
    },
    {
        key: "gloves",
        icon: GiGloves,
        weapons: [
            "weapon_glove_sporty", "weapon_glove_slick",
            "weapon_glove_handwrap", "weapon_glove_motorcycle",
            "weapon_glove_specialist", "weapon_glove_hydra",
        ],
    },
];

// ── Rarity colors ─────────────────────────────────────────────────────────
const rarityColors: Record<string, string> = {
    Contraband: "#e4ae39",
    Covert: "#eb4b4b",
    Classified: "#d32ce6",
    Restricted: "#8847ff",
    "Mil-Spec": "#4b69ff",
    Industrial: "#5e98d9",
    Consumer: "#b0c3d9",
};

// ── Fallback mock skins (used when Convex skins table is empty) ───────────
const FALLBACK_SKINS = [
    { _id: "mock_1", name: "Dragon Lore", weapon: "AWP", weaponId: "weapon_awp", rarity: "Covert", paintIndex: 344, imageSlug: "awp_dragon_lore", minFloat: 0.0, maxFloat: 0.7 },
    { _id: "mock_2", name: "Fire Serpent", weapon: "AK-47", weaponId: "weapon_ak47", rarity: "Covert", paintIndex: 180, imageSlug: "ak47_fire_serpent", minFloat: 0.0, maxFloat: 0.7 },
    { _id: "mock_3", name: "Howl", weapon: "M4A4", weaponId: "weapon_m4a1", rarity: "Contraband", paintIndex: 309, imageSlug: "m4a4_howl", minFloat: 0.0, maxFloat: 0.4 },
    { _id: "mock_4", name: "Doppler (Phase 2)", weapon: "Karambit", weaponId: "weapon_knife_karambit", rarity: "Covert", paintIndex: 418, imageSlug: "karambit_doppler_p2", minFloat: 0.0, maxFloat: 0.08 },
    { _id: "mock_5", name: "Fade", weapon: "Butterfly Knife", weaponId: "weapon_knife_butterfly", rarity: "Covert", paintIndex: 38, imageSlug: "butterfly_fade", minFloat: 0.0, maxFloat: 0.08 },
    { _id: "mock_6", name: "Fade", weapon: "Glock-18", weaponId: "weapon_glock", rarity: "Classified", paintIndex: 38, imageSlug: "glock_fade", minFloat: 0.0, maxFloat: 0.08 },
    { _id: "mock_7", name: "Printstream", weapon: "USP-S", weaponId: "weapon_usp_silencer", rarity: "Covert", paintIndex: 1028, imageSlug: "usps_printstream", minFloat: 0.0, maxFloat: 0.5 },
    { _id: "mock_8", name: "Blaze", weapon: "Desert Eagle", weaponId: "weapon_deagle", rarity: "Classified", paintIndex: 37, imageSlug: "deagle_blaze", minFloat: 0.0, maxFloat: 0.08 },
    { _id: "mock_9", name: "Printstream", weapon: "M4A1-S", weaponId: "weapon_m4a1_silencer", rarity: "Covert", paintIndex: 1028, imageSlug: "m4a1s_printstream", minFloat: 0.0, maxFloat: 0.5 },
    { _id: "mock_10", name: "Asiimov", weapon: "AWP", weaponId: "weapon_awp", rarity: "Covert", paintIndex: 279, imageSlug: "awp_asiimov", minFloat: 0.18, maxFloat: 1.0 },
    { _id: "mock_11", name: "Vulcan", weapon: "AK-47", weaponId: "weapon_ak47", rarity: "Covert", paintIndex: 302, imageSlug: "ak47_vulcan", minFloat: 0.0, maxFloat: 1.0 },
    { _id: "mock_12", name: "Hyper Beast", weapon: "M4A1-S", weaponId: "weapon_m4a1_silencer", rarity: "Covert", paintIndex: 430, imageSlug: "m4a1s_hyper_beast", minFloat: 0.0, maxFloat: 1.0 },
];

// ── Wear label helper ─────────────────────────────────────────────────────
function getWearLabel(wear: number): string {
    if (wear < 0.07) return "Factory New";
    if (wear < 0.15) return "Minimal Wear";
    if (wear < 0.38) return "Field-Tested";
    if (wear < 0.45) return "Well-Worn";
    return "Battle-Scarred";
}

// ── Steam CDN image URL builder ───────────────────────────────────────────
function getSkinImage(skin: { weapon: string; name: string }): string {
    // Use Steam community images as a fallback
    const query = encodeURIComponent(`${skin.weapon} ${skin.name}`);
    return `https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpo/360fx360f`;
}

export default function SkinsCatalogPage() {
    const t = useTranslations("SkinsPage");
    const { playClick, playHit, playVictory } = useAudio();
    const { user } = useAuth();

    // ── State ─────────────────────────────────────────────────────────────
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSkin, setSelectedSkin] = useState<typeof FALLBACK_SKINS[0] | null>(null);
    const [floatValue, setFloatValue] = useState(0.01);
    const [seed, setSeed] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // ── Convex queries ────────────────────────────────────────────────────
    const convexSkins = useQuery(api.loadout.getAllSkins);
    const userLoadout = useQuery(api.loadout.getUserLoadout);
    const addToLoadout = useMutation(api.loadout.addSkinToLoadout);
    const removeFromLoadout = useMutation(api.loadout.removeSkinFromLoadout);

    // Use Convex data if available, fallback to mock data
    const skins = (convexSkins && convexSkins.length > 0 ? convexSkins : FALLBACK_SKINS) as typeof FALLBACK_SKINS;

    // ── Filter skins ─────────────────────────────────────────────────────
    const filteredSkins = useMemo(() => {
        const category = weaponCategories.find((c) => c.key === activeCategory);
        return skins.filter((skin) => {
            const matchesCategory = activeCategory === "all" || category?.weapons.includes(skin.weaponId);
            const matchesSearch =
                skin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                skin.weapon.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [skins, activeCategory, searchQuery]);

    // ── Check if a skin is in the user's loadout ─────────────────────────
    const isInLoadout = (weaponId: string, paintIndex: number) => {
        if (!userLoadout || !Array.isArray(userLoadout)) return false;
        return userLoadout.some((s) => s.weaponId === weaponId && s.paintIndex === paintIndex);
    };

    // ── Save skin to loadout ─────────────────────────────────────────────
    const handleSaveToLoadout = async () => {
        if (!selectedSkin || !user) return;
        try {
            await addToLoadout({
                weaponId: selectedSkin.weaponId,
                paintIndex: selectedSkin.paintIndex,
                seed: seed,
                wear: floatValue,
            });
            playVictory();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
            console.error("Failed to save skin:", err);
        }
    };

    // ── Remove skin from loadout ─────────────────────────────────────────
    const handleRemoveFromLoadout = async (weaponId: string) => {
        try {
            await removeFromLoadout({ weaponId });
            playClick();
        } catch (err) {
            console.error("Failed to remove skin:", err);
        }
    };

    return (
        <VideoBackground opacity={0.05}>
            <div style={{ display: "flex", minHeight: "100vh" }}>
                {/* ── Weapon Category Sidebar ──────────────────────────────────── */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                width: "240px",
                                minWidth: "240px",
                                background: "rgba(10, 10, 10, 0.95)",
                                borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                                padding: "20px 0",
                                position: "sticky",
                                top: 0,
                                height: "100vh",
                                overflowY: "auto",
                                zIndex: 10,
                            }}
                        >
                            <div style={{ padding: "0 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <h3
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "2px",
                                        color: "#888",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {t("categories")}
                                </h3>
                            </div>

                            {weaponCategories.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = activeCategory === cat.key;
                                return (
                                    <motion.button
                                        key={cat.key}
                                        onClick={() => {
                                            setActiveCategory(cat.key);
                                            playClick();
                                        }}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px 20px",
                                            width: "100%",
                                            background: isActive
                                                ? "linear-gradient(90deg, rgba(235, 75, 75, 0.15), transparent)"
                                                : "transparent",
                                            color: isActive ? "#eb4b4b" : "#aaa",
                                            border: "none",
                                            borderLeft: isActive ? "3px solid #eb4b4b" : "3px solid transparent",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: isActive ? 700 : 400,
                                            textAlign: "left",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <Icon size={18} />
                                        {t(cat.key)}
                                    </motion.button>
                                );
                            })}

                            {/* Loadout Summary */}
                            {userLoadout && Array.isArray(userLoadout) && userLoadout.length > 0 && (
                                <div style={{ margin: "20px 16px", padding: "12px", background: "rgba(235, 75, 75, 0.08)", borderRadius: "8px", border: "1px solid rgba(235, 75, 75, 0.15)" }}>
                                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#eb4b4b", marginBottom: "8px" }}>
                                        {t("yourLoadout")} ({userLoadout.length})
                                    </h4>
                                    {userLoadout.map((item) => (
                                        <div
                                            key={item.weaponId}
                                            style={{
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                                padding: "4px 0", fontSize: "12px", color: "#ccc",
                                            }}
                                        >
                                            <span>{item.weaponId.replace("weapon_", "")}</span>
                                            <button
                                                onClick={() => handleRemoveFromLoadout(item.weaponId)}
                                                style={{ background: "none", border: "none", color: "#eb4b4b", cursor: "pointer", padding: "2px" }}
                                            >
                                                <IoTrashOutline size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* ── Main Content ─────────────────────────────────────────────── */}
                <div style={{ flex: 1, padding: "24px 32px" }}>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: "28px" }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <h1
                                    style={{
                                        fontSize: "clamp(24px, 4vw, 36px)",
                                        fontWeight: 900,
                                        fontFamily: "Orbitron, Inter, sans-serif",
                                        marginBottom: "4px",
                                    }}
                                >
                                    CS2 <span style={{ background: "linear-gradient(135deg, #eb4b4b, #ff8a00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                        {t("title")}
                                    </span>
                                </h1>
                                <p style={{ color: "#888", fontSize: "14px" }}>{t("subtitle")}</p>
                            </div>

                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#ccc",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "13px",
                                }}
                            >
                                <IoChevronForward
                                    style={{
                                        transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease",
                                    }}
                                />
                                {t("categories")}
                            </button>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <div style={{ position: "relative", maxWidth: "400px", marginBottom: "24px" }}>
                        <IoSearchOutline style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
                        <input
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                            style={{
                                paddingLeft: "36px",
                                margin: 0,
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        />
                    </div>

                    {/* Skin Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
                        {filteredSkins.map((skin, i) => {
                            const inLoadout = isInLoadout(skin.weaponId, skin.paintIndex);
                            return (
                                <motion.div
                                    key={skin._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    whileHover={{ y: -4, boxShadow: `0 8px 30px -10px ${rarityColors[skin.rarity] || "#333"}40` }}
                                    onClick={() => {
                                        setSelectedSkin(skin);
                                        setFloatValue(skin.minFloat);
                                        setSeed(0);
                                        playClick();
                                    }}
                                    style={{
                                        padding: 0,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        background: "linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)",
                                        borderTop: `2px solid ${rarityColors[skin.rarity] || "#333"}`,
                                        borderRadius: "8px",
                                        border: selectedSkin?._id === skin._id
                                            ? `2px solid ${rarityColors[skin.rarity] || "#fff"}`
                                            : `1px solid rgba(255,255,255,0.05)`,
                                        borderTopWidth: "2px",
                                        borderTopColor: rarityColors[skin.rarity] || "#333",
                                        position: "relative",
                                    }}
                                >
                                    {inLoadout && (
                                        <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 2 }}>
                                            <IoCheckmarkCircle size={20} color="#00c853" />
                                        </div>
                                    )}

                                    <div style={{
                                        height: "140px", padding: "16px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
                                    }}>
                                        <img
                                            src={getSkinImage(skin)}
                                            alt={`${skin.weapon} | ${skin.name}`}
                                            style={{ maxWidth: "90%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.4))" }}
                                        />
                                    </div>

                                    <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "2px" }}>
                                            {skin.weapon} | {skin.name}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                                            <span style={{
                                                fontSize: "11px", padding: "3px 8px",
                                                background: `${rarityColors[skin.rarity] || "#333"}20`,
                                                color: rarityColors[skin.rarity] || "#ccc",
                                                borderRadius: "4px", fontWeight: 600,
                                            }}>
                                                {skin.rarity}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#666" }}>
                                                {skin.minFloat.toFixed(2)} - {skin.maxFloat.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filteredSkins.length === 0 && (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#666", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "8px" }}>
                                <IoFilterOutline size={40} style={{ opacity: 0.2, marginBottom: "12px" }} />
                                <p>{t("noResults")}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Skin Detail Panel ─────────────────────────────────────────── */}
                <AnimatePresence>
                    {selectedSkin && (
                        <motion.div
                            initial={{ x: 360, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 360, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                width: "320px",
                                minWidth: "320px",
                                background: "rgba(10, 10, 10, 0.98)",
                                borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
                                padding: "24px",
                                position: "sticky",
                                top: 0,
                                height: "100vh",
                                overflowY: "auto",
                                zIndex: 10,
                            }}
                        >
                            {/* Close */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#888" }}>
                                    {t("skinDetails")}
                                </h3>
                                <button
                                    onClick={() => { setSelectedSkin(null); playClick(); }}
                                    style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}
                                >
                                    <IoClose size={20} />
                                </button>
                            </div>

                            {/* Preview */}
                            <div style={{
                                height: "180px", display: "flex", alignItems: "center", justifyContent: "center",
                                background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
                                borderRadius: "8px", marginBottom: "20px",
                                border: `1px solid ${rarityColors[selectedSkin.rarity]}30`,
                            }}>
                                <img
                                    src={getSkinImage(selectedSkin)}
                                    alt={selectedSkin.name}
                                    style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }}
                                />
                            </div>

                            {/* Info */}
                            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "white", marginBottom: "4px" }}>
                                {selectedSkin.weapon} | {selectedSkin.name}
                            </h2>
                            <div style={{
                                display: "inline-block", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 700,
                                background: `${rarityColors[selectedSkin.rarity]}20`,
                                color: rarityColors[selectedSkin.rarity],
                                marginBottom: "20px",
                            }}>
                                {selectedSkin.rarity}
                            </div>

                            {/* Float Slider */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                                    {t("floatValue")}: <span style={{ color: "#fff", fontWeight: 700 }}>{floatValue.toFixed(4)}</span>
                                    <span style={{ color: "#666", marginLeft: "8px" }}>({getWearLabel(floatValue)})</span>
                                </label>
                                <input
                                    type="range"
                                    min={selectedSkin.minFloat}
                                    max={selectedSkin.maxFloat}
                                    step={0.0001}
                                    value={floatValue}
                                    onChange={(e) => setFloatValue(parseFloat(e.target.value))}
                                    style={{ width: "100%", accentColor: rarityColors[selectedSkin.rarity] || "#eb4b4b" }}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555", marginTop: "4px" }}>
                                    <span>{selectedSkin.minFloat.toFixed(2)}</span>
                                    <span>{selectedSkin.maxFloat.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Seed */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                                    {t("patternSeed")}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={999}
                                    value={seed}
                                    onChange={(e) => setSeed(Math.min(999, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="input-field"
                                    style={{
                                        margin: 0, width: "100%",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                />
                            </div>

                            {/* Paint Index */}
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" }}>
                                <span style={{ color: "#888" }}>{t("paintIndex")}</span>
                                <span style={{ color: "#fff", fontFamily: "monospace" }}>{selectedSkin.paintIndex}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" }}>
                                <span style={{ color: "#888" }}>{t("weaponId")}</span>
                                <span style={{ color: "#fff", fontFamily: "monospace", fontSize: "11px" }}>{selectedSkin.weaponId}</span>
                            </div>

                            {/* Save Button */}
                            {user && (
                                <motion.button
                                    onClick={handleSaveToLoadout}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        width: "100%",
                                        marginTop: "24px",
                                        padding: "14px",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        background: saveSuccess
                                            ? "linear-gradient(135deg, #00c853, #00e676)"
                                            : "linear-gradient(135deg, #eb4b4b, #ff8a00)",
                                        color: "white",
                                        transition: "background 0.3s ease",
                                    }}
                                >
                                    {saveSuccess ? (
                                        <>
                                            <IoCheckmarkCircle size={18} /> {t("saved")}
                                        </>
                                    ) : (
                                        <>
                                            <IoSaveOutline size={18} /> {t("saveToLoadout")}
                                        </>
                                    )}
                                </motion.button>
                            )}

                            {!user && (
                                <p style={{ marginTop: "20px", textAlign: "center", color: "#666", fontSize: "13px" }}>
                                    {t("loginToSave")}
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </VideoBackground>
    );
}
