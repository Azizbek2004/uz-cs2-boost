"use client";

import React, { useMemo } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import DashboardCard from "@/components/DashboardCard";
import VideoBackground from "@/components/VideoBackground";
import OnboardingModal from "@/components/OnboardingModal";
import {
  IoSpeedometerOutline,
  IoPulseOutline,
  IoGameControllerOutline,
  IoPeopleOutline,
  IoTrophyOutline,
  IoRocketOutline,
  IoMedalOutline,
  IoWalletOutline,
  IoFlameOutline,
  IoBarChartOutline,
  IoBulbOutline,
} from "react-icons/io5";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();

  const skillData = useMemo(() => {
    if (!user || !user.skillPoints) return [];
    return [
      { subject: "Aim", A: user.skillPoints.aim || 0, fullMark: 100 },
      { subject: "Spray", A: user.skillPoints.spray || 0, fullMark: 100 },
      { subject: "Movement", A: user.skillPoints.movement || 0, fullMark: 100 },
      { subject: "Utility", A: user.skillPoints.utility || 0, fullMark: 100 },
      { subject: "Sense", A: user.skillPoints.gameSense || 0, fullMark: 100 },
    ];
  }, [user]);

  // Find easiest recommendation based on lowest skill point
  const recommendation = useMemo(() => {
    if (!user || !user.skillPoints)
      return {
        text: "Complete your assessment to get recommendations.",
        map: "Aim Botz",
        icon: <IoGameControllerOutline />,
      };

    const skills = Object.entries(user.skillPoints);
    if (skills.length === 0)
      return {
        text: "Train all aspects.",
        map: "Aim Botz",
        icon: <IoGameControllerOutline />,
      };

    skills.sort((a, b) => (a[1] as number) - (b[1] as number));
    const lowest = skills[0][0];

    switch (lowest) {
      case "aim":
        return {
          text: "Your aim accuracy needs work. Focus on flicking.",
          map: "Aim Botz (Static)",
          command: "steam://connect/45.132.227.123:27015/+map aim_botz",
          icon: <IoGameControllerOutline style={{ color: "#ff6b00" }} />,
        };
      case "spray":
        return {
          text: "Your spray control is inconsistent. Let's learn AK-47 patterns.",
          map: "Recoil Master",
          command: "steam://connect/45.132.227.123:27015/+map recoil_master",
          icon: <IoBarChartOutline style={{ color: "#00c853" }} />,
        };
      case "movement":
        return {
          text: "Improve your peeking and counter-strafing.",
          map: "Yprac Aim (Medium)",
          command: "steam://connect/45.132.227.123:27015/+map yprac_aim",
          icon: <IoRocketOutline style={{ color: "#007bff" }} />,
        };
      case "utility":
        return {
          text: "Learn essential smokes for Mirage.",
          map: "Mirage Utility",
          command: "steam://connect/45.132.227.123:27015/+map mirage_yprac",
          icon: <IoBulbOutline style={{ color: "#ffd700" }} />,
        };
      case "gameSense":
        return {
          text: "Play more scrims to improve positioning.",
          map: "Find a Scrim",
          command: "/community",
          icon: <IoPeopleOutline style={{ color: "#7c4dff" }} />,
          isLink: true,
        };
      default:
        return {
          text: "Ready to train.",
          map: "Aim Botz",
          command: "steam://connect/45.132.227.123:27015/+map aim_botz",
          icon: <IoGameControllerOutline />,
        };
    }
  }, [user]);

  if (!user) {
    return <meta httpEquiv="refresh" content="0;url=/auth" />;
  }

  return (
    <VideoBackground opacity={0.06}>
      <OnboardingModal />
      <div className="page-container">
        {/* Header with Gamification */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "800",
                fontFamily: "Orbitron, Inter, sans-serif",
                marginBottom: "8px",
              }}
            >
              Command <span className="gradient-text">Center</span>
            </h1>
            <p style={{ color: "#888", fontSize: "14px" }}>
              Welcome back, {user.name}. Your journey to Global Elite continues.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div
              className="hud-frame"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
              }}
            >
              <IoMedalOutline size={20} color="#ff6b00" />
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#888",
                    textTransform: "uppercase",
                  }}
                >
                  Rank
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  {user.rank || "Novice"}
                </div>
              </div>
            </div>
            <div
              className="hud-frame"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
              }}
            >
              <IoWalletOutline size={20} color="#00c853" />
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#888",
                    textTransform: "uppercase",
                  }}
                >
                  UZS Balance
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#00c853",
                  }}
                >
                  {user.uzsBalance || 0}
                </div>
              </div>
            </div>
            <div
              className="hud-frame"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
              }}
            >
              <IoFlameOutline size={20} color="#ff3b30" />
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#888",
                    textTransform: "uppercase",
                  }}
                >
                  Daily Streak
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  {user.loginStreak || 0} Days
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Core Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Live Training Status (Today's Focus) */}
          <DashboardCard
            title="Today's Focus"
            value=" "
            subtitle="Based on recent performance"
            icon={<IoGameControllerOutline />}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <div
                style={{ fontSize: "20px", fontWeight: "700", color: "white" }}
              >
                {recommendation.text.split(".")[1] || "Aim & Flicks"}
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {recommendation.icon}
                  <span style={{ fontSize: "14px", color: "#ddd" }}>
                    {recommendation.map}
                  </span>
                </div>
                {recommendation.isLink ? (
                  <Link href={recommendation.command || "/community"}>
                    <button
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: "12px" }}
                    >
                      Go to Scrims
                    </button>
                  </Link>
                ) : (
                  <a href={recommendation.command}>
                    <button
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: "12px" }}
                    >
                      Launch Map
                    </button>
                  </a>
                )}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                {recommendation.text.split(".")[0] + "."}
              </div>
            </div>
          </DashboardCard>

          {/* Skill Radar Chart */}
          <DashboardCard
            title="Skill Radar"
            value=" "
            subtitle="Last 7 Days (Points)"
            icon={<IoBarChartOutline />}
          >
            <div style={{ width: "100%", height: "200px" }}>
              {skillData.length > 0 && skillData.some((d) => d.A > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={skillData}
                  >
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#888", fontSize: 12 }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#ff6b00"
                      fill="#ff6b00"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Complete your onboarding to see your radar.
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Secondary Network & Social Grid */}
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
          Network & Community Hub
        </h2>
        <div className="dashboard-grid" style={{ marginBottom: "32px" }}>
          <Link href="/ping-booster" style={{ textDecoration: "none" }}>
            <DashboardCard
              title="Current Ping"
              value="45ms"
              subtitle="Last scan: 2 hours ago"
              icon={<IoSpeedometerOutline />}
              accentColor="#ff6b00"
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#00c853",
                    animation: "pulse-glow 2s infinite",
                  }}
                />
                <span style={{ fontSize: "12px", color: "#00c853" }}>
                  Good connection
                </span>
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

          <Link href="/community" style={{ textDecoration: "none" }}>
            <DashboardCard
              title="FACEIT Elo"
              value={user.faceitElo || "1,450"}
              subtitle={`Level ${user.faceitLevel || 5} • ${user.faceitNickname || "Not linked"}`}
              icon={<IoTrophyOutline />}
              accentColor="#ffd700"
            />
          </Link>

          <DashboardCard
            title="Next Match"
            value="20:00 UZT"
            subtitle="Tashkent Weekly Tournament"
            icon={<IoPeopleOutline />}
            accentColor="#7c4dff"
          >
            <Link href="/community" style={{ textDecoration: "none" }}>
              <button
                style={{
                  marginTop: "12px",
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "#7c4dff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                View Bracket
              </button>
            </Link>
          </DashboardCard>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              {
                href: "/ping-booster",
                label: "Run Ping Scan",
                icon: <IoRocketOutline size={20} />,
                color: "#ff6b00",
              },
              {
                href: "/spray-simulator",
                label: "Practice Spray",
                icon: <IoGameControllerOutline size={20} />,
                color: "#00c853",
              },
              {
                href: "/community",
                label: "Find Scrim",
                icon: <IoPeopleOutline size={20} />,
                color: "#007bff",
              },
              {
                href: "/jitter-diagnostic",
                label: "Check Jitter",
                icon: <IoPulseOutline size={20} />,
                color: "#ffd700",
              },
            ].map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                style={{ textDecoration: "none" }}
              >
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
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "white",
                    }}
                  >
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </VideoBackground>
  );
}
