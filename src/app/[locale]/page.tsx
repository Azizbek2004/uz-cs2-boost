"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import VideoBackground from "@/components/VideoBackground";
import { useTranslations, useLocale } from "next-intl";
import {
  IoSpeedometerOutline,
  IoPulseOutline,
  IoGameControllerOutline,
  IoPeopleOutline,
  IoSchoolOutline,
  IoColorPaletteOutline,
  IoRocketOutline,
  IoTrophyOutline,
} from "react-icons/io5";

const features = [
  {
    icon: <IoSpeedometerOutline size={36} />,
    title: "Advanced Diagnostics",
    description:
      "Deep network analysis, routing inspection, and connection optimization to global CS2 datacenters.",
    color: "#ff6b00",
    href: "/advanced-diagnostics",
  },
  {
    icon: <IoPulseOutline size={36} />,
    title: "Jitter Diagnostic",
    description:
      "Deep network analysis with before/after visualizations. Fix stability issues fast.",
    color: "#007bff",
    href: "/jitter-diagnostic",
  },
  {
    icon: <IoGameControllerOutline size={36} />,
    title: "Training Rooms",
    description:
      "One-click connect to the best CS2 practice maps — aim, spray, movement, and utility training.",
    color: "#00c853",
    href: "/training",
  },
  {
    icon: <IoPeopleOutline size={36} />,
    title: "FACEIT Community",
    description:
      "Local leaderboards, scrim finder, and tournament hub for UZ CS2 players.",
    color: "#ffd700",
    href: "/community",
  },
  {
    icon: <IoSchoolOutline size={36} />,
    title: "Esports Academy",
    description:
      "Free coaching sessions with IT Park Game Dev Academy. Level up your game.",
    color: "#7c4dff",
    href: "/academy",
  },
  {
    icon: <IoColorPaletteOutline size={36} />,
    title: "Skins Catalog",
    description:
      "Browse, search, and discover the best CS2 weapon skins with real-time market pricing.",
    color: "#e91e63",
    href: "/skins",
  },
];

const stats = [
  { value: "5K+", label: "Active Players", icon: <IoPeopleOutline /> },
  { value: "<30ms", label: "Avg Ping Reduction", icon: <IoRocketOutline /> },
  { value: "50+", label: "Tournaments Hosted", icon: <IoTrophyOutline /> },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const { playClick } = useAudio();
  const t = useTranslations("HomePage");

  const locale = useLocale();

  // If loading, show nothing (prevents false redirect)
  if (isLoading) {
    return <div style={{ minHeight: "100vh", background: "#0a0a0a" }} />;
  }

  // If logged in, redirect to dashboard
  if (user) {
    return <meta httpEquiv="refresh" content={`0;url=/${locale}/dashboard`} />;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <VideoBackground opacity={0.18}>
        {/* Hero Section */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "40px 24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ff6b00, #cc5500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "28px",
                color: "white",
                margin: "0 auto 24px",
                boxShadow: "0 0 40px rgba(255,107,0,0.3)",
                fontFamily: "Orbitron, sans-serif",
              }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(255,107,0,0.2)",
                  "0 0 50px rgba(255,107,0,0.4)",
                  "0 0 30px rgba(255,107,0,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              UZ
            </motion.div>

            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: "900",
                lineHeight: 1.1,
                marginBottom: "16px",
                fontFamily: "Orbitron, Inter, sans-serif",
              }}
            >
              {t("title")
                .split(" ")
                .map((w, i) =>
                  i === 1 ? (
                    <span key={i} className="gradient-text">
                      {" "}
                      {w}
                    </span>
                  ) : i === 0 ? (
                    w
                  ) : (
                    ` ${w}`
                  ),
                )}
            </h1>

            <p
              style={{
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: "#aaa",
                maxWidth: "600px",
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              {t("subtitle")}
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/auth" onClick={() => playClick()}>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontSize: "16px", padding: "16px 40px" }}
                >
                  {t("getStarted")}
                </motion.button>
              </Link>
              <Link href="/auth" onClick={() => playClick()}>
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  style={{ fontSize: "16px", padding: "16px 40px" }}
                >
                  {t("signIn")}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "60px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "#ff6b00",
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{
              textAlign: "center",
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: "800",
              marginBottom: "16px",
              fontFamily: "Orbitron, Inter, sans-serif",
            }}
          >
            <span className="gradient-text">TOOLS FOR DOMINATION</span>
          </motion.h2>
          <p
            style={{
              textAlign: "center",
              color: "#888",
              marginBottom: "48px",
              maxWidth: "500px",
              margin: "0 auto 48px",
            }}
          >
            Everything you need to climb the ranks and dominate the competition.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link
                  href={user ? feature.href : "/auth"}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    className="hud-frame"
                    whileHover={{ scale: 1.03, y: -6 }}
                    style={{ padding: "28px", height: "100%" }}
                  >
                    <div style={{ color: feature.color, marginBottom: "16px" }}>
                      {feature.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "8px",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#aaa",
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            padding: "80px 24px",
            textAlign: "center",
            borderTop: "1px solid #1e1e1e",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontSize: "clamp(20px, 3vw, 32px)",
                fontWeight: "800",
                marginBottom: "16px",
                fontFamily: "Orbitron, Inter, sans-serif",
              }}
            >
              Ready to <span className="gradient-text">BOOST</span> your game?
            </h2>
            <p style={{ color: "#888", marginBottom: "32px" }}>
              Join the growing community of UZ CS2 players.
            </p>
            <Link href="/auth">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playClick()}
                style={{ fontSize: "16px", padding: "16px 48px" }}
              >
                Join Now — It&apos;s Free
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: "32px 24px",
            borderTop: "1px solid #1e1e1e",
            textAlign: "center",
            color: "#555",
            fontSize: "13px",
          }}
        >
          <p>© 2026 UZ CS2 Boost. All rights reserved.</p>
          <div
            style={{
              display: "flex",
              gap: "24px",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            <Link
              href="/privacy"
              style={{ color: "#888", textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
            <a
              href="https://www.gearupbooster.com/?ref=uzcs2boost"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#888", textDecoration: "none" }}
            >
              Affiliate: GearUp Booster
            </a>
          </div>
        </footer>
      </VideoBackground>
    </div>
  );
}
