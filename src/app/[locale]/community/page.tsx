"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import LeaderboardTable from "@/components/LeaderboardTable";
import {
  IoPeopleOutline,
  IoSearchOutline,
  IoTrophyOutline,
  IoCalendarOutline,
  IoAddCircleOutline,
} from "react-icons/io5";

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  {
    _id: "1",
    playerName: "TashkentSniper",
    faceitElo: 2340,
    faceitLevel: 10,
    wins: 450,
    losses: 200,
    winRate: 69.2,
    avgKd: 1.45,
  },
  {
    _id: "2",
    playerName: "SamarkandKing",
    faceitElo: 2180,
    faceitLevel: 9,
    wins: 380,
    losses: 190,
    winRate: 66.7,
    avgKd: 1.32,
  },
  {
    _id: "3",
    playerName: "BukharaAce",
    faceitElo: 2050,
    faceitLevel: 9,
    wins: 320,
    losses: 180,
    winRate: 64.0,
    avgKd: 1.28,
  },
  {
    _id: "4",
    playerName: "FerganaFlash",
    faceitElo: 1920,
    faceitLevel: 8,
    wins: 290,
    losses: 210,
    winRate: 58.0,
    avgKd: 1.15,
  },
  {
    _id: "5",
    playerName: "NavoiNinja",
    faceitElo: 1850,
    faceitLevel: 8,
    wins: 260,
    losses: 200,
    winRate: 56.5,
    avgKd: 1.1,
  },
  {
    _id: "6",
    playerName: "AndijonAssault",
    faceitElo: 1780,
    faceitLevel: 7,
    wins: 240,
    losses: 210,
    winRate: 53.3,
    avgKd: 1.05,
  },
  {
    _id: "7",
    playerName: "KashkaFlick",
    faceitElo: 1700,
    faceitLevel: 7,
    wins: 220,
    losses: 200,
    winRate: 52.4,
    avgKd: 1.02,
  },
  {
    _id: "8",
    playerName: "NukusHero",
    faceitElo: 1650,
    faceitLevel: 6,
    wins: 200,
    losses: 190,
    winRate: 51.3,
    avgKd: 0.98,
  },
  {
    _id: "9",
    playerName: "UrgenchUltra",
    faceitElo: 1580,
    faceitLevel: 6,
    wins: 180,
    losses: 190,
    winRate: 48.6,
    avgKd: 0.95,
  },
  {
    _id: "10",
    playerName: "DzhizzakhDemon",
    faceitElo: 1520,
    faceitLevel: 5,
    wins: 170,
    losses: 200,
    winRate: 45.9,
    avgKd: 0.9,
  },
];

const MOCK_SCRIMS = [
  {
    id: "s1",
    title: "Dust2 5v5 Competitive",
    creator: "TashkentSniper",
    minElo: 1500,
    maxElo: 2500,
    map: "de_dust2",
    players: 7,
    maxPlayers: 10,
    time: "Tonight 21:00",
  },
  {
    id: "s2",
    title: "Mirage Pug",
    creator: "SamarkandKing",
    minElo: 1200,
    maxElo: 2000,
    map: "de_mirage",
    players: 4,
    maxPlayers: 10,
    time: "Tomorrow 19:00",
  },
  {
    id: "s3",
    title: "Inferno Practice",
    creator: "BukharaAce",
    minElo: 1000,
    maxElo: 1800,
    map: "de_inferno",
    players: 6,
    maxPlayers: 10,
    time: "Saturday 20:00",
  },
];

const MOCK_TOURNAMENTS = [
  {
    id: "t1",
    title: "UZ CS2 Weekly Cup #12",
    status: "registration",
    prize: "500,000 UZS",
    format: "5v5 BO3",
    teams: 12,
    maxTeams: 16,
    date: "March 5, 2025",
  },
  {
    id: "t2",
    title: "Tashkent Masters S2",
    status: "upcoming",
    prize: "2,000,000 UZS",
    format: "5v5 BO5",
    teams: 0,
    maxTeams: 32,
    date: "March 15, 2025",
  },
  {
    id: "t3",
    title: "UZ FACEIT League",
    status: "in_progress",
    prize: "1,000,000 UZS",
    format: "5v5 Swiss",
    teams: 16,
    maxTeams: 16,
    date: "Ongoing",
  },
];

type Tab = "leaderboard" | "scrims" | "tournaments";

export default function CommunityPage() {
  const { user } = useAuth();
  const { playClick } = useAudio();
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [scrimSearch, setScrimSearch] = useState("");
  const [showCreateScrim, setShowCreateScrim] = useState(false);

  if (!user) return <meta httpEquiv="refresh" content="0;url=/auth" />;

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
          <IoPeopleOutline
            style={{ verticalAlign: "middle", marginRight: "12px" }}
          />
          <span className="gradient-text">FACEIT UZ COMMUNITY</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "24px" }}>
          Local leaderboards, scrim finder, and tournaments for Uzbekistan CS2
          players.
        </p>
      </motion.div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          borderBottom: "1px solid #333",
          paddingBottom: "0",
        }}
      >
        {(
          [
            {
              key: "leaderboard",
              label: "Leaderboard",
              icon: <IoTrophyOutline />,
            },
            { key: "scrims", label: "Scrims", icon: <IoSearchOutline /> },
            {
              key: "tournaments",
              label: "Tournaments",
              icon: <IoCalendarOutline />,
            },
          ] as { key: Tab; label: string; icon: React.ReactNode }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              playClick();
              setActiveTab(tab.key);
            }}
            style={{
              padding: "12px 20px",
              background:
                activeTab === tab.key ? "rgba(255,107,0,0.1)" : "transparent",
              border: "none",
              borderBottom:
                activeTab === tab.key
                  ? "2px solid #ff6b00"
                  : "2px solid transparent",
              color: activeTab === tab.key ? "#ff6b00" : "#888",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="hud-frame"
            style={{ padding: "0", overflow: "hidden" }}
          >
            <LeaderboardTable entries={MOCK_LEADERBOARD} />
          </div>
        </motion.div>
      )}

      {/* Scrims Tab */}
      {activeTab === "scrims" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Search + Create */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
              <IoSearchOutline
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#888",
                }}
              />
              <input
                type="text"
                value={scrimSearch}
                onChange={(e) => setScrimSearch(e.target.value)}
                placeholder="Search scrims by map, elo range..."
                className="input-field"
                style={{ paddingLeft: "36px" }}
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                playClick();
                setShowCreateScrim(!showCreateScrim);
              }}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <IoAddCircleOutline size={18} /> Create Scrim
            </button>
          </div>

          {/* Create Scrim Form */}
          {showCreateScrim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="hud-frame"
              style={{ padding: "24px", marginBottom: "20px" }}
            >
              <h3
                style={{
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#ff6b00",
                }}
              >
                Create New Scrim
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <input className="input-field" placeholder="Scrim title" />
                <select className="input-field">
                  <option>de_dust2</option>
                  <option>de_mirage</option>
                  <option>de_inferno</option>
                  <option>de_nuke</option>
                  <option>de_anubis</option>
                </select>
                <input
                  className="input-field"
                  placeholder="Min Elo"
                  type="number"
                />
                <input
                  className="input-field"
                  placeholder="Max Elo"
                  type="number"
                />
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: "16px" }}
                onClick={() => {
                  playClick();
                  setShowCreateScrim(false);
                }}
              >
                Create Scrim
              </button>
            </motion.div>
          )}

          {/* Scrim Cards */}
          <div style={{ display: "grid", gap: "12px" }}>
            {MOCK_SCRIMS.filter((s) =>
              scrimSearch
                ? s.title.toLowerCase().includes(scrimSearch.toLowerCase()) ||
                  s.map.toLowerCase().includes(scrimSearch.toLowerCase())
                : true,
            ).map((scrim, i) => (
              <motion.div
                key={scrim.id}
                className="hud-frame"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: "700",
                      color: "white",
                      marginBottom: "4px",
                    }}
                  >
                    {scrim.title}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "13px",
                      color: "#888",
                    }}
                  >
                    <span>🗺️ {scrim.map}</span>
                    <span>
                      📊 Elo: {scrim.minElo}-{scrim.maxElo}
                    </span>
                    <span>
                      👥 {scrim.players}/{scrim.maxPlayers}
                    </span>
                    <span>⏰ {scrim.time}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      marginTop: "4px",
                    }}
                  >
                    by {scrim.creator}
                  </div>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => playClick()}
                  style={{ padding: "8px 20px", fontSize: "13px" }}
                >
                  Join
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tournaments Tab */}
      {activeTab === "tournaments" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            {MOCK_TOURNAMENTS.map((t, i) => (
              <motion.div
                key={t.id}
                className="hud-frame"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                style={{
                  padding: "24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Status badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    background:
                      t.status === "registration"
                        ? "rgba(0,200,83,0.15)"
                        : t.status === "upcoming"
                          ? "rgba(255,107,0,0.15)"
                          : "rgba(0,123,255,0.15)",
                    color:
                      t.status === "registration"
                        ? "#00c853"
                        : t.status === "upcoming"
                          ? "#ff6b00"
                          : "#007bff",
                  }}
                >
                  {t.status.replace("_", " ")}
                </div>

                <h3
                  style={{
                    fontWeight: "700",
                    color: "white",
                    marginBottom: "12px",
                    paddingRight: "80px",
                  }}
                >
                  {t.title}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <span style={{ color: "#888" }}>Prize:</span>{" "}
                    <span style={{ color: "#ffd700", fontWeight: "600" }}>
                      {t.prize}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#888" }}>Format:</span>{" "}
                    <span style={{ color: "#ddd" }}>{t.format}</span>
                  </div>
                  <div>
                    <span style={{ color: "#888" }}>Teams:</span>{" "}
                    <span style={{ color: "#ddd" }}>
                      {t.teams}/{t.maxTeams}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#888" }}>Date:</span>{" "}
                    <span style={{ color: "#ddd" }}>{t.date}</span>
                  </div>
                </div>

                <button
                  className={
                    t.status === "registration" ? "btn-primary" : "btn-ghost"
                  }
                  onClick={() => playClick()}
                  style={{ width: "100%", fontSize: "13px" }}
                  disabled={t.status === "in_progress"}
                >
                  {t.status === "registration"
                    ? "Register Team"
                    : t.status === "upcoming"
                      ? "Notify Me"
                      : "View Bracket"}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
