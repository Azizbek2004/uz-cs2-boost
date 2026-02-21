"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "./AuthProvider";
import { useAudio } from "./AudioProvider";
import {
  IoScanOutline,
  IoWalkOutline,
  IoBulbOutline,
  IoGameControllerOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const WEAKNESS_OPTIONS = [
  { id: "aim", label: "Flicking & Aim", icon: IoScanOutline, color: "#ff6b00" },
  {
    id: "spray",
    label: "Spray Control",
    icon: IoGameControllerOutline,
    color: "#00c853",
  },
  {
    id: "movement",
    label: "Movement & Peeks",
    icon: IoWalkOutline,
    color: "#007bff",
  },
  {
    id: "utility",
    label: "Utility & Nades",
    icon: IoShieldCheckmarkOutline,
    color: "#ffd700",
  },
  {
    id: "gameSense",
    label: "Game Sense",
    icon: IoBulbOutline,
    color: "#7c4dff",
  },
];

export default function OnboardingModal() {
  const { user } = useAuth();
  const { playClick } = useAudio();
  const updateGamification = useMutation(api.users.updateGamification);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding. If skillPoints are totally 0 (as initialized), show modal.
    if (user && user.skillPoints) {
      const sum = Object.values(user.skillPoints).reduce(
        (a: any, b: any) => a + b,
        0,
      );
      if (sum === 0 && !localStorage.getItem(`onboarding_${user._id}`)) {
        setIsOpen(true);
      }
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!selectedId || !user) return;

    playClick();
    setIsSubmitting(true);

    // Assign some base points to get them started. Give less points to their weakness, more to others.
    const newSkills = {
      aim: selectedId === "aim" ? 10 : 30,
      spray: selectedId === "spray" ? 10 : 30,
      movement: selectedId === "movement" ? 10 : 30,
      utility: selectedId === "utility" ? 10 : 30,
      gameSense: selectedId === "gameSense" ? 10 : 30,
    };

    try {
      await updateGamification({
        userId: user._id as any,
        skillPoints: newSkills,
        uzsBalance: (user.uzsBalance || 0) + 100, // Onboarding bonus
      });

      localStorage.setItem(`onboarding_${user._id}`, "true");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save onboarding assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="hud-frame"
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "32px",
            backgroundColor: "#111",
            border: "1px solid #333",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px inset rgba(255,255,255,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              fontFamily: "Orbitron, Inter, sans-serif",
              marginBottom: "8px",
              color: "white",
            }}
          >
            Welcome to the <span className="gradient-text">Command Center</span>
          </h2>
          <p
            style={{
              color: "#aaa",
              fontSize: "14px",
              marginBottom: "24px",
              lineHeight: 1.5,
            }}
          >
            To personalize your recommended training routine, tell us about your
            current gameplay.
            <strong> What is your biggest weakness?</strong>
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {WEAKNESS_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              const Icon = option.icon;

              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playClick();
                    setSelectedId(option.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? "rgba(255, 107, 0, 0.1)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isSelected ? option.color : "rgba(255, 255, 255, 0.1)"}`,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ color: option.color }}>
                    <Icon size={24} />
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? "white" : "#ccc",
                    }}
                  >
                    {option.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!selectedId || isSubmitting}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              opacity: !selectedId || isSubmitting ? 0.5 : 1,
              cursor: !selectedId || isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isSubmitting
              ? "Generating Profile..."
              : "Start Training Assessment (+100 UZS)"}
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
              marginTop: "16px",
            }}
          >
            Takes &lt; 60 seconds. We'll set up your first routine right after.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
