import React from "react";
import DashboardCard from "@/components/DashboardCard";
import VideoBackground from "@/components/VideoBackground";
import {
  IoShieldCheckmarkOutline,
  IoLaptopOutline,
  IoPodiumOutline,
  IoCashOutline,
  IoAddCircleOutline,
} from "react-icons/io5";

export default function PartnerDashboardPage() {
  return (
    <VideoBackground opacity={0.06}>
      <div className="page-container">
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #00c853, #009624)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Partner Portal
              </div>
            </div>
            <h1>
              LAN Center <span className="gradient-text">Command</span>
            </h1>
            <p style={{ color: "#aaa", fontSize: "16px" }}>
              Manage your PCs, live tournaments, and revenue.
            </p>
          </div>

          <button
            className="primary-button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
            }}
          >
            <IoAddCircleOutline size={20} />
            New Tournament
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <DashboardCard
            title="Active PCs"
            value="12 / 20"
            subtitle="Currently Online"
            icon={<IoLaptopOutline />}
          >
            <div
              style={{
                padding: "12px",
                background: "rgba(0, 200, 83, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(0, 200, 83, 0.2)",
              }}
            >
              <div
                style={{
                  color: "#00c853",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                Network Status: Excellent (1ms LAN)
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Live Tournament"
            value="Tashkent Cup Qualifiers"
            subtitle="Match 3 in progress"
            icon={<IoPodiumOutline />}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ff6b00",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ color: "white", fontSize: "14px" }}>
                Server 1: Team A vs Team B (11-9)
              </span>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Today's Revenue"
            value="1,250,000 UZS"
            subtitle="Entry Fees & Rental"
            icon={<IoCashOutline />}
          >
            <div style={{ color: "#aaa", fontSize: "14px", marginTop: "8px" }}>
              Platform Cut: -375,000 UZS (30%)
            </div>
          </DashboardCard>
        </div>

        {/* PC Grid Visualization */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h3
            style={{
              color: "white",
              marginTop: 0,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <IoShieldCheckmarkOutline color="#00c853" /> Fleet Manager
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "16px",
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background:
                    i < 12 ? "rgba(0, 200, 83, 0.1)" : "rgba(255,255,255,0.03)",
                  border:
                    i < 12
                      ? "1px solid rgba(0, 200, 83, 0.3)"
                      : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  opacity: i < 12 ? 1 : 0.5,
                }}
              >
                <IoLaptopOutline
                  size={24}
                  color={i < 12 ? "#00c853" : "#aaa"}
                />
                <div
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  PC-{String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    color: i < 12 ? "#00c853" : "#aaa",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {i < 10 ? "In Match" : i < 12 ? "Online" : "Offline"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VideoBackground>
  );
}
