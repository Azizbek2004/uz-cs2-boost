"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAudio } from "@/components/AudioProvider";
import VideoBackground from "@/components/VideoBackground";
import { useTranslations, useLocale } from "next-intl";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Add password state
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playClick, playVictory, playError } = useAudio();
  const { signIn } = useAuthActions();
  const t = useTranslations("Auth");
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      setError(t("errorMissingEmailPassword"));
      playError();
      setIsSubmitting(false);
      return;
    }

    if (!isLogin && !name.trim()) {
      setError(t("errorMissingName"));
      playError();
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("password", password.trim());
      formData.append("flow", isLogin ? "signIn" : "signUp");

      await signIn("password", formData);
      playVictory();

      // The Convex provider will update, triggering a redirect in the layout or component if needed.
      // But we can eagerly redirect.
      window.location.href = `/${locale}/dashboard`;
    } catch (err: any) {
      setError(err?.message || t("errorGeneric"));
      playError();
      setIsSubmitting(false);
    }
  };

  return (
    <VideoBackground opacity={0.1}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hud-frame"
          style={{
            padding: "40px",
            maxWidth: "440px",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ff6b00, #cc5500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "20px",
                color: "white",
                margin: "0 auto 16px",
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              UZ
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "800",
                fontFamily: "Orbitron, Inter, sans-serif",
              }}
            >
              <span className="gradient-text">
                {isLogin ? t("titleLogin") : t("titleSignup")}
              </span>
            </h1>
            <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
              {isLogin ? t("subtitleLogin") : t("subtitleSignup")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ marginBottom: "16px" }}
              >
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {t("playerName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder={t("playerNamePlaceholder")}
                />
              </motion.div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder={t("passwordPlaceholder")}
                  required
                />
              </div>
            )}

            {isLogin && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder={t("passwordPlaceholder")}
                  required
                />
              </div>
            )}

            {error && (
              <p
                style={{
                  color: "#ff1744",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              style={{ width: "100%", marginBottom: "16px", fontSize: "15px", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? t("processing") : isLogin ? t("signIn") : t("createAccount")}
            </motion.button>

            {/* OAuth buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ flex: 1, fontSize: "13px", padding: "10px" }}
                onClick={() => {
                  playClick();
                  // For OAuth in convex-dev/auth, we just pass the provider name
                  // e.g. signIn("steam") or signIn("github")
                  // Here we mock it slightly since we only set up Password provider for now
                  setError(t("errorOauthNotConfigured"));
                }}
              >
                🎮 Steam
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ flex: 1, fontSize: "13px", padding: "10px" }}
                onClick={() => {
                  playClick();
                  setError(t("errorOauthNotConfigured"));
                }}
              >
                🏆 FACEIT
              </button>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setIsLogin(!isLogin);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff6b00",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {isLogin ? t("toggleToSignup") : t("toggleToLogin")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </VideoBackground>
  );
}
