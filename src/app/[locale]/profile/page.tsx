"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import {
  IoPersonOutline,
  IoSettingsOutline,
  IoStarOutline,
  IoGameControllerOutline,
  IoSpeedometerOutline,
  IoPulseOutline,
  IoTrophyOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
  IoColorPaletteOutline,
} from "react-icons/io5";
import { useLocale } from "next-intl";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { playClick, playVictory, isEnabled, toggle } = useAudio();
  const [activeTab, setActiveTab] = useState<"stats" | "settings" | "premium">(
    "stats",
  );
  const [steamId, setSteamId] = useState(user?.steamId || "");
  const [faceitNickname, setFaceitNickname] = useState(
    user?.faceitNickname || "",
  );
  const [isp, setIsp] = useState(user?.isp || "");
  const [city, setCity] = useState(user?.city || "Tashkent");

  const locale = useLocale();

  if (!user) return <meta httpEquiv="refresh" content={`0;url=/${locale}/auth`} />;

  const handleSaveSettings = () => {
    playVictory();
    updateUser({ steamId, faceitNickname, isp, city });
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
          <IoPersonOutline
            style={{ verticalAlign: "middle", marginRight: "12px" }}
          />
          <span className="gradient-text">PROFILE</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "24px" }}>
          {user.email} • {user.isPremium ? "⭐ Premium" : "Free Tier"}
        </p>
      </motion.div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          borderBottom: "1px solid #333",
        }}
      >
        {[
          { key: "stats" as const, label: "Stats", icon: <IoTrophyOutline /> },
          {
            key: "settings" as const,
            label: "Settings",
            icon: <IoSettingsOutline />,
          },
          {
            key: "premium" as const,
            label: "Premium",
            icon: <IoStarOutline />,
          },
        ].map((tab) => (
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
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="stats-grid" style={{ marginBottom: "24px" }}>
            {[
              {
                label: "FACEIT Elo",
                value: user.faceitElo || "1,450",
                icon: <IoTrophyOutline />,
                color: "#ffd700",
              },
              {
                label: "FACEIT Level",
                value: user.faceitLevel || "5",
                icon: <IoStarOutline />,
                color: "#ff6b00",
              },
              {
                label: "Avg Ping",
                value: "45ms",
                icon: <IoSpeedometerOutline />,
                color: "#00c853",
              },
              {
                label: "Avg Jitter",
                value: "8ms",
                icon: <IoPulseOutline />,
                color: "#007bff",
              },
              {
                label: "Best Spray",
                value: "78%",
                icon: <IoGameControllerOutline />,
                color: "#7c4dff",
              },
              {
                label: "Sessions",
                value: "142",
                icon: <IoGameControllerOutline />,
                color: "#ff6b00",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="hud-frame"
                style={{ padding: "20px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="hud-frame" style={{ padding: "24px" }}>
            <h3
              style={{
                fontWeight: "600",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              Player Info
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                fontSize: "14px",
              }}
            >
              <div>
                <span style={{ color: "#888" }}>Name:</span>{" "}
                <span style={{ color: "white" }}>{user.name}</span>
              </div>
              <div>
                <span style={{ color: "#888" }}>Email:</span>{" "}
                <span style={{ color: "white" }}>{user.email}</span>
              </div>
              <div>
                <span style={{ color: "#888" }}>Steam:</span>{" "}
                <span style={{ color: user.steamId ? "white" : "#555" }}>
                  {user.steamId || "Not linked"}
                </span>
              </div>
              <div>
                <span style={{ color: "#888" }}>FACEIT:</span>{" "}
                <span style={{ color: user.faceitNickname ? "white" : "#555" }}>
                  {user.faceitNickname || "Not linked"}
                </span>
              </div>
              <div>
                <span style={{ color: "#888" }}>ISP:</span>{" "}
                <span style={{ color: "white" }}>{user.isp || "Unknown"}</span>
              </div>
              <div>
                <span style={{ color: "#888" }}>City:</span>{" "}
                <span style={{ color: "white" }}>
                  {user.city || "Tashkent"}
                </span>
              </div>
              <div>
                <span style={{ color: "#888" }}>Prime:</span>{" "}
                <span style={{ color: user.isPrime ? "#00c853" : "#555" }}>
                  {user.isPrime ? "Yes" : "Unknown"}
                </span>
              </div>
              <div>
                <span style={{ color: "#888" }}>Plan:</span>{" "}
                <span style={{ color: user.isPremium ? "#ffd700" : "#888" }}>
                  {user.isPremium ? "Premium" : "Free"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="hud-frame"
            style={{ padding: "28px", maxWidth: "600px" }}
          >
            <h3
              style={{
                fontWeight: "700",
                marginBottom: "20px",
                color: "#ff6b00",
              }}
            >
              Profile Settings
            </h3>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Steam ID
                </label>
                <input
                  className="input-field"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  placeholder="STEAM_0:1:12345678"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  FACEIT Nickname
                </label>
                <input
                  className="input-field"
                  value={faceitNickname}
                  onChange={(e) => setFaceitNickname(e.target.value)}
                  placeholder="YourFACEITName"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  ISP Provider
                </label>
                <select
                  className="input-field"
                  value={isp}
                  onChange={(e) => setIsp(e.target.value)}
                >
                  <option value="">Select your ISP</option>
                  <option value="UzNet">UzNet</option>
                  <option value="Sarkor Telecom">Sarkor Telecom</option>
                  <option value="TuronTelecom">TuronTelecom</option>
                  <option value="UzMobile">UzMobile</option>
                  <option value="Beeline UZ">Beeline UZ</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  City
                </label>
                <select
                  className="input-field"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="Tashkent">Tashkent</option>
                  <option value="Samarkand">Samarkand</option>
                  <option value="Bukhara">Bukhara</option>
                  <option value="Nukus">Nukus</option>
                  <option value="Fergana">Fergana</option>
                  <option value="Andijan">Andijan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid #333",
              }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  color: "#888",
                  fontSize: "13px",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Preferences
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <button
                  onClick={toggle}
                  className="btn-ghost"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "flex-start",
                  }}
                >
                  {isEnabled ? (
                    <IoVolumeHighOutline />
                  ) : (
                    <IoVolumeMuteOutline />
                  )}
                  Sound: {isEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button className="btn-primary" onClick={handleSaveSettings}>
                Save Changes
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  playClick();
                  logout();
                  window.location.href = `/${locale}`;
                }}
                style={{ color: "#ff1744" }}
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Tab */}
      {activeTab === "premium" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Free Plan */}
            <div className="hud-frame" style={{ padding: "28px" }}>
              <h3 style={{ fontWeight: "700", marginBottom: "4px" }}>Free</h3>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#888",
                  marginBottom: "16px",
                }}
              >
                $0
                <span style={{ fontSize: "14px", fontWeight: "400" }}>/mo</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                }}
              >
                {[
                  "Basic ping diagnostics",
                  "Spray simulator (3 weapons)",
                  "Community leaderboard",
                  "Scrim finder",
                  "Free academy sessions",
                ].map((f) => (
                  <div
                    key={f}
                    style={{ color: "#aaa", display: "flex", gap: "8px" }}
                  >
                    <span style={{ color: "#00c853" }}>✓</span> {f}
                  </div>
                ))}
              </div>
              {!user.isPremium && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "8px 16px",
                    background: "rgba(0,200,83,0.1)",
                    borderRadius: "6px",
                    textAlign: "center",
                    color: "#00c853",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  Current Plan
                </div>
              )}
            </div>

            {/* Premium Plan */}
            <div
              className="hud-frame glow-orange"
              style={{ padding: "28px", border: "1px solid #ff6b00" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <h3 style={{ fontWeight: "700", color: "#ff6b00" }}>Premium</h3>
                <span
                  style={{
                    background: "#ff6b00",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  RECOMMENDED
                </span>
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#ff6b00",
                  marginBottom: "16px",
                }}
              >
                $3
                <span
                  style={{ fontSize: "14px", fontWeight: "400", color: "#888" }}
                >
                  /mo
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                }}
              >
                {[
                  "Everything in Free",
                  "Advanced analytics dashboard",
                  "Personalized spray tips",
                  "Premium leaderboards",
                  "Priority scrim matching",
                  "Detailed FACEIT stats",
                  "Exclusive tournaments",
                  "Priority support",
                ].map((f) => (
                  <div
                    key={f}
                    style={{ color: "#ddd", display: "flex", gap: "8px" }}
                  >
                    <span style={{ color: "#ff6b00" }}>★</span> {f}
                  </div>
                ))}
              </div>
              <motion.button
                className="btn-primary"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClick();
                  // Would open Stripe checkout in production
                  window.open("https://checkout.stripe.com/test", "_blank");
                }}
                style={{ width: "100%", marginTop: "20px" }}
              >
                {user.isPremium ? "Manage Subscription" : "Upgrade to Premium"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
