import React from "react";
import VideoBackground from "@/components/VideoBackground";
import {
  IoShieldHalfOutline,
  IoCheckmarkCircle,
  IoConstructOutline,
  IoRocketOutline,
} from "react-icons/io5";

export default function PartnerOnboardingPage() {
  return (
    <VideoBackground opacity={0.06}>
      <div
        className="page-container"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <IoShieldHalfOutline
            size={64}
            color="#ff6b00"
            style={{ marginBottom: "16px" }}
          />
          <h1>
            Become an <span className="gradient-text">Esports Hub</span>
          </h1>
          <p style={{ color: "#aaa", fontSize: "18px" }}>
            Join the premium network of LAN centers in Uzbekistan and run
            professional zero-ping tournaments.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0, marginBottom: "24px" }}>
            Certification Checklist
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <input
                type="checkbox"
                style={{
                  marginTop: "4px",
                  width: "18px",
                  height: "18px",
                  accentColor: "#ff6b00",
                }}
              />
              <div>
                <div
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  Hardware Fleet
                </div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>
                  At least 10 active Gaming PCs capable of running CS2 at
                  144Hz+.
                </div>
              </div>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <input
                type="checkbox"
                style={{
                  marginTop: "4px",
                  width: "18px",
                  height: "18px",
                  accentColor: "#ff6b00",
                }}
              />
              <div>
                <div
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  Network Infrastructure
                </div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>
                  Dedicated Gigabit LAN switch connecting all tournament PCs. No
                  unstable WiFi.
                </div>
              </div>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <input
                type="checkbox"
                style={{
                  marginTop: "4px",
                  width: "18px",
                  height: "18px",
                  accentColor: "#ff6b00",
                }}
              />
              <div>
                <div
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  Host PC Capabilities
                </div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>
                  One dedicated Host PC (Intel i5/Ryzen 5+, 16GB RAM) to run the
                  Local Server Manager App and Host the Dedicated Server.
                </div>
              </div>
            </label>
          </div>

          <div
            style={{
              marginTop: "32px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "32px",
            }}
          >
            <h3 style={{ color: "white", marginTop: 0, marginBottom: "16px" }}>
              Host App Installation
            </h3>
            <p
              style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}
            >
              Download and install our Tauri desktop application on your
              designated Host PC. This app handles local zero-ping server
              creation and anti-cheat.
            </p>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                className="secondary-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <IoConstructOutline size={20} />
                Download Windows App (.exe)
              </button>
              <button
                className="primary-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <IoRocketOutline size={20} />
                Submit for Certification
              </button>
            </div>
          </div>
        </div>
      </div>
    </VideoBackground>
  );
}
