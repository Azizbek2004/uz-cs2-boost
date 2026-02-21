"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import VideoBackground from "@/components/VideoBackground";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const { playClick, playVictory, playError } = useAudio();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            playError();
            return;
        }

        if (!isLogin && !name.trim()) {
            setError("Name is required for sign up");
            playError();
            return;
        }

        playVictory();
        login(email.trim(), name.trim() || email.split("@")[0]);

        // Redirect to dashboard
        window.location.href = "/dashboard";
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
                            <span className="gradient-text">{isLogin ? "WELCOME BACK" : "JOIN THE FIGHT"}</span>
                        </h1>
                        <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
                            {isLogin ? "Sign in to your UZ CS2 Boost account" : "Create your competitive edge"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                style={{ marginBottom: "16px" }}
                            >
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                    Player Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="Your CS2 nickname"
                                />
                            </motion.div>
                        )}

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="player@example.com"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {error && (
                            <p style={{ color: "#ff1744", fontSize: "13px", marginBottom: "16px" }}>
                                {error}
                            </p>
                        )}

                        <motion.button
                            type="submit"
                            className="btn-primary"
                            whileTap={{ scale: 0.97 }}
                            style={{ width: "100%", marginBottom: "16px", fontSize: "15px" }}
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </motion.button>

                        {/* OAuth buttons */}
                        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                            <button
                                type="button"
                                className="btn-ghost"
                                style={{ flex: 1, fontSize: "13px", padding: "10px" }}
                                onClick={() => {
                                    playClick();
                                    login(email || "steam@user.com", name || "SteamPlayer");
                                    window.location.href = "/dashboard";
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
                                    login(email || "faceit@user.com", name || "FACEITPlayer");
                                    window.location.href = "/dashboard";
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
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </VideoBackground>
    );
}
