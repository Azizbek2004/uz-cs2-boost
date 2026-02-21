"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardCard from "@/components/DashboardCard";
import VideoBackground from "@/components/VideoBackground";
import {
  IoSearchOutline,
  IoGameControllerOutline,
  IoPulseOutline,
  IoRocketOutline,
  IoFlagOutline,
} from "react-icons/io5";

const categories = ["All", "Aim & Warmup", "Spray Control", "Utility", "Movement", "Crosshair"];

const trainingMaps = [
  { id: 1, name: "Aim Botz", author: "Mr. uLLeticaL", category: "Aim & Warmup", image: "aim_botz", desc: "The legendary warmup map. Customize bots, distance, and weapons.", command: "steam://connect/45.132.227.123:27015/+map aim_botz" },
  { id: 2, name: "CSGOHUB Skills Training", author: "ESL", category: "Aim & Warmup", image: "csgohub", desc: "Comprehensive warmup facility with multiple modes.", command: "steam://connect/45.132.227.123:27015/+map csgohub" },
  { id: 3, name: "Recoil Master", author: "Mr. uLLeticaL", category: "Spray Control", image: "recoil_master", desc: "Learn spray patterns for every weapon with visual guides.", command: "steam://connect/45.132.227.123:27015/+map recoil_master" },
  { id: 4, name: "Fast Aim / Reflex", author: "cr0", category: "Aim & Warmup", image: "fast_aim", desc: "Improve flick shots and tracking against running bots.", command: "steam://connect/45.132.227.123:27015/+map fast_aim_reflex" },
  { id: 5, name: "Yprac Mirage Guide", author: "Yesber", category: "Utility", image: "yprac_mirage", desc: "Learn all essential smokes, flashes, and molotovs on Mirage.", command: "steam://connect/45.132.227.123:27015/+map yprac_mirage" },
  { id: 6, name: "Yprac Inferno Guide", author: "Yesber", category: "Utility", image: "yprac_inferno", desc: "Master banana control and site executes on Inferno.", command: "steam://connect/45.132.227.123:27015/+map yprac_inferno" },
  { id: 7, name: "Yprac Dust2 Guide", author: "Yesber", category: "Utility", image: "yprac_dust2", desc: "Essential utility for taking mid and sites on Dust 2.", command: "steam://connect/45.132.227.123:27015/+map yprac_dust2" },
  { id: 8, name: "Surf Mesa", author: "Surfer", category: "Movement", image: "surf_mesa", desc: "Classic Tier 1-2 surf map for movement practice.", command: "steam://connect/45.132.227.123:27015/+map surf_mesa" },
  { id: 9, name: "Surf Utopia", author: "Surfer", category: "Movement", image: "surf_utopia", desc: "Smooth, flowing surf map perfect for practicing air strafing.", command: "steam://connect/45.132.227.123:27015/+map surf_utopia" },
  { id: 10, name: "KZ_Comp", author: "Kreedz", category: "Movement", image: "kz_comp", desc: "Competitive climbing map to master jumping mechanics.", command: "steam://connect/45.132.227.123:27015/+map kz_comp" },
  { id: 11, name: "Bhop_Areal", author: "Hopper", category: "Movement", image: "bhop_areal", desc: "String together perfect bunny hops across floating platforms.", command: "steam://connect/45.132.227.123:27015/+map bhop_areal" },
  { id: 12, name: "Yprac Aim Arena", author: "Yesber", category: "Aim & Warmup", image: "yprac_arena", desc: "Intense 360-degree aim practice.", command: "steam://connect/45.132.227.123:27015/+map yprac_arena" },
  { id: 13, name: "Yprac Nuke Guide", author: "Yesber", category: "Utility", image: "yprac_nuke", desc: "Outside smokes and yard control utility.", command: "steam://connect/45.132.227.123:27015/+map yprac_nuke" },
  { id: 14, name: "Yprac Vertigo Guide", author: "Yesber", category: "Utility", image: "yprac_vertigo", desc: "A-ramp takes and middle control smokes.", command: "steam://connect/45.132.227.123:27015/+map yprac_vertigo" },
  { id: 15, name: "Yprac Overpass Guide", author: "Yesber", category: "Utility", image: "yprac_overpass", desc: "Monster, toilets, and bank smoke guides.", command: "steam://connect/45.132.227.123:27015/+map yprac_overpass" },
  { id: 16, name: "Yprac Peak Practice: Mirage", author: "Yesber", category: "Crosshair", image: "peak_mirage", desc: "Pre-fire and angle isolation practice for Mirage.", command: "steam://connect/45.132.227.123:27015/+map yprac_mirage_peeks" },
  { id: 17, name: "Yprac Peak Practice: Inferno", author: "Yesber", category: "Crosshair", image: "peak_inferno", desc: "Pre-fire and angle isolation practice for Inferno.", command: "steam://connect/45.132.227.123:27015/+map yprac_inferno_peeks" },
  { id: 18, name: "DC_Aim_Course", author: "DC", category: "Aim & Warmup", image: "dc_aim", desc: "Run through a time-trial course shooting targets.", command: "steam://connect/45.132.227.123:27015/+map dc_aim_course" },
  { id: 19, name: "Crashz' Crosshair Generator", author: "Crashz", category: "Aim & Warmup", image: "crashz_ch", desc: "Not just for crosshairs—great for testing on bots too.", command: "steam://connect/45.132.227.123:27015/+map crashz_crosshair" },
  { id: 20, name: "Training Center 1.5c", author: "Dreaz", category: "Aim & Warmup", image: "training_center", desc: "Old school, highly effective multi-room training complex.", command: "steam://connect/45.132.227.123:27015/+map training_center" },
];

export default function TrainingRoomsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaps = trainingMaps.filter((map) => {
    const matchesCategory = activeCategory === "All" || map.category === activeCategory;
    const matchesSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase()) || map.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <VideoBackground opacity={0.05}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px", textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: "900",
              fontFamily: "Orbitron, Inter, sans-serif",
              marginBottom: "8px",
            }}
          >
            ADVANCED <span className="gradient-text">TRAINING ROOMS</span>
          </h1>
          <p style={{ color: "#888", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
            The top 20 curated CS2 practice maps. One click to connect and dominate. Powered by UZ CS2 Boost dedicated servers.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "32px", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn-ghost ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  background: activeCategory === cat ? "rgba(255, 107, 0, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  color: activeCategory === cat ? "#ff6b00" : "#888",
                  border: activeCategory === cat ? "1px solid rgba(255, 107, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
            <IoSearchOutline style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
            <input
              type="text"
              placeholder="Search maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: "36px", margin: 0 }}
            />
          </div>
        </div>

        {/* Map Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {filteredMaps.map((map, i) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="hud-frame"
              style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  height: "140px",
                  background: "linear-gradient(45deg, #111, #222)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderBottom: "1px solid rgba(255,255,255,0.05)"
                }}
              >
                {map.category === "Aim & Warmup" && <IoTargetOutline size={48} color="rgba(255,255,255,0.1)" />}
                {map.category === "Spray Control" && <IoPulseOutline size={48} color="rgba(255,255,255,0.1)" />}
                {map.category === "Utility" && <IoBulbOutline size={48} color="rgba(255,255,255,0.1)" />}
                {map.category === "Movement" && <IoRocketOutline size={48} color="rgba(255,255,255,0.1)" />}
                {map.category === "Crosshair" && <IoLocateOutline size={48} color="rgba(255,255,255,0.1)" />}

                <div style={{
                  position: "absolute", bottom: "8px", right: "8px",
                  background: "rgba(0,0,0,0.6)", padding: "4px 8px",
                  borderRadius: "4px", fontSize: "10px", fontWeight: "700",
                  color: "#ff6b00", textTransform: "uppercase"
                }}>
                  {map.category}
                </div>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "white", marginBottom: "4px" }}>{map.name}</h3>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>by {map.author}</div>
                <p style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.5, marginBottom: "20px", flex: 1 }}>
                  {map.desc}
                </p>

                <a href={map.command} style={{ textDecoration: "none" }}>
                  <motion.button
                    className="btn-primary"
                    whileTap={{ scale: 0.95 }}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    <IoGameControllerOutline /> Load Map
                  </motion.button>
                </a>
              </div>
            </motion.div>
          ))}

          {filteredMaps.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#888" }}>
              No maps found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </VideoBackground>
  );
}

// Additional icons needed for visuals
const IoTargetOutline = IoGameControllerOutline;
const IoLocateOutline = IoSearchOutline;
const IoBulbOutline = IoFlagOutline;
