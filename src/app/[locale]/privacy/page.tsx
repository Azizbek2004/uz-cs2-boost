"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

export default function PrivacyPage() {
  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
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
          <IoShieldCheckmarkOutline
            style={{ verticalAlign: "middle", marginRight: "12px" }}
          />
          <span className="gradient-text">PRIVACY POLICY</span>
        </h1>
        <p style={{ color: "#888", marginBottom: "32px" }}>
          Last updated: February 2025
        </p>
      </motion.div>

      <div className="hud-frame" style={{ padding: "32px" }}>
        <div style={{ color: "#ddd", fontSize: "14px", lineHeight: 1.8 }}>
          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
              marginTop: "0",
            }}
          >
            1. Introduction
          </h2>
          <p style={{ marginBottom: "20px" }}>
            UZ CS2 Boost (&quot;we,&quot; &quot;our,&quot; &quot;the
            Service&quot;) respects your privacy and is committed to protecting
            your personal data. This policy outlines how we collect, use, and
            protect information from users in Uzbekistan and beyond.
          </p>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            2. Data We Collect
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Account Info:</strong> Email, display name, and optional
              gaming profile links (Steam ID, FACEIT nickname).
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Usage Data:</strong> Spray simulator scores, ping
              diagnostic results, and feature usage analytics.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Network Data:</strong> ISP information, ping/jitter
              metrics (collected locally and optionally stored for history).
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Payment Data:</strong> Processed securely via Stripe. We
              do not store credit card numbers.
            </li>
          </ul>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            3. How We Use Your Data
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              Provide and improve our Service features.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Display leaderboards and community statistics.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Process premium subscriptions via Stripe.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Personalize your experience (e.g., ISP-specific suggestions).
            </li>
          </ul>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            4. Third-Party Services
          </h2>
          <p style={{ marginBottom: "12px" }}>
            We integrate with the following third-party services:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>FACEIT API:</strong> To display player stats and Elo
              rankings.{" "}
              <a
                href="https://developers.faceit.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Steam API:</strong> For Prime status verification.{" "}
              <a
                href="https://store.steampowered.com/privacy_agreement/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Stripe:</strong> For payment processing.{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                Privacy Policy
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Convex:</strong> Backend database and real-time features.{" "}
              <a
                href="https://www.convex.dev/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                Privacy Policy
              </a>
            </li>
          </ul>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            5. Affiliate Disclosure
          </h2>
          <p
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              background: "rgba(255,107,0,0.08)",
              borderRadius: "8px",
              border: "1px solid rgba(255,107,0,0.2)",
            }}
          >
            UZ CS2 Boost participates in affiliate programs. We earn commissions
            from qualifying purchases made through affiliate links on our
            platform. Currently, we partner with{" "}
            <a
              href="https://www.gearupbooster.com/?ref=uzcs2boost"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ff6b00" }}
            >
              GearUp Booster
            </a>
            . This does not affect the price you pay. We only recommend products
            we believe will improve your gaming experience.
          </p>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            6. Data Security
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We implement industry-standard security measures including HTTPS
            encryption, secure API key storage (server-side only via Convex
            environment variables), input validation, and CORS protection. No
            sensitive API keys are exposed client-side.
          </p>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            7. Your Rights (GDPR-Aligned)
          </h2>
          <p style={{ marginBottom: "12px" }}>You have the right to:</p>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              Access, correct, or delete your personal data.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Export your data in a machine-readable format.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Withdraw consent and delete your account at any time.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Object to data processing for marketing purposes.
            </li>
          </ul>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            8. Data Retention
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Account data is retained as long as your account is active.
            Diagnostic history (ping/jitter) is retained for 90 days. Spray
            simulator scores are retained indefinitely for leaderboard purposes.
            You may request deletion at any time.
          </p>

          <h2
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            9. Contact
          </h2>
          <p style={{ marginBottom: "12px" }}>
            For privacy questions, data requests, or concerns, contact us at:
          </p>
          <p style={{ color: "#ff6b00" }}>privacy@uzcs2boost.com</p>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "24px 0",
          color: "#555",
          fontSize: "13px",
        }}
      >
        <Link href="/" style={{ color: "#888", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
