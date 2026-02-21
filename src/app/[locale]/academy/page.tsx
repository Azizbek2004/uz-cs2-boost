"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAudio } from "@/components/AudioProvider";
import {
    IoSchoolOutline,
    IoCheckmarkCircleOutline,
    IoGameControllerOutline,
    IoAnalyticsOutline,
    IoPeopleOutline,
} from "react-icons/io5";

const COURSES = [
    {
        title: "CS2 Fundamentals",
        desc: "Movement, crosshair placement, economy management. Perfect for beginners.",
        level: "Beginner",
        duration: "4 weeks",
        icon: <IoGameControllerOutline size={28} />,
        color: "#00c853",
    },
    {
        title: "Advanced Tactics",
        desc: "Utility lineups, site executes, retake strategies for FACEIT Level 5+.",
        level: "Intermediate",
        duration: "6 weeks",
        icon: <IoAnalyticsOutline size={28} />,
        color: "#ff6b00",
    },
    {
        title: "Pro Team Play",
        desc: "IGL training, anti-strats, demo review sessions with pro coaches.",
        level: "Advanced",
        duration: "8 weeks",
        icon: <IoPeopleOutline size={28} />,
        color: "#7c4dff",
    },
];

export default function AcademyPage() {
    const { user } = useAuth();
    const { playClick, playVictory } = useAudio();
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "beginner",
        preferredTime: "evening",
        message: "",
    });

    if (!user) return <meta httpEquiv="refresh" content="0;url=/auth" />;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        playVictory();
        setSubmitted(true);
        setShowForm(false);
    };

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", fontFamily: "Orbitron, Inter, sans-serif", marginBottom: "8px" }}>
                    <IoSchoolOutline style={{ verticalAlign: "middle", marginRight: "12px" }} />
                    <span className="gradient-text">ESPORTS ACADEMY</span>
                </h1>
                <p style={{ color: "#888", marginBottom: "8px" }}>
                    Free coaching sessions powered by Uzbekistan IT Park Game Dev Academy.
                </p>
                <p style={{ color: "#555", fontSize: "13px", marginBottom: "32px" }}>
                    In partnership with IT Park — empowering the next generation of esports athletes.
                </p>
            </motion.div>

            {/* Course Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                {COURSES.map((course, i) => (
                    <motion.div
                        key={course.title}
                        className="hud-frame"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -6 }}
                        style={{ padding: "28px" }}
                    >
                        <div style={{ color: course.color, marginBottom: "16px" }}>{course.icon}</div>
                        <h3 style={{ fontWeight: "700", color: "white", marginBottom: "8px", fontSize: "18px" }}>
                            {course.title}
                        </h3>
                        <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.5, marginBottom: "16px" }}>
                            {course.desc}
                        </p>
                        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#888" }}>
                            <span style={{
                                padding: "4px 10px",
                                borderRadius: "4px",
                                background: `${course.color}15`,
                                color: course.color,
                                fontWeight: "600",
                            }}>
                                {course.level}
                            </span>
                            <span style={{ padding: "4px 0" }}>⏱ {course.duration}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            {!submitted && !showForm && (
                <motion.div
                    className="hud-frame glow-orange"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: "32px", textAlign: "center", marginBottom: "24px" }}
                >
                    <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>
                        Ready to level up?
                    </h2>
                    <p style={{ color: "#888", marginBottom: "20px" }}>
                        Sign up for a free coaching session. Limited slots available each week.
                    </p>
                    <motion.button
                        className="btn-primary"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { playClick(); setShowForm(true); }}
                        style={{ fontSize: "15px", padding: "14px 36px" }}
                    >
                        Sign Up for Free Session
                    </motion.button>
                </motion.div>
            )}

            {/* Success Message */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hud-frame glow-orange"
                        style={{ padding: "32px", textAlign: "center", marginBottom: "24px" }}
                    >
                        <IoCheckmarkCircleOutline size={48} style={{ color: "#00c853", marginBottom: "12px" }} />
                        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#00c853", marginBottom: "8px" }}>
                            Application Submitted!
                        </h2>
                        <p style={{ color: "#888" }}>
                            We&apos;ll contact you within 48 hours to schedule your free coaching session.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Signup Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="hud-frame"
                        style={{ padding: "32px", maxWidth: "600px" }}
                    >
                        <h3 style={{ fontWeight: "700", marginBottom: "20px", color: "#ff6b00" }}>
                            Free Coaching Session Signup
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "grid", gap: "16px" }}>
                                <div>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                        Full Name *
                                    </label>
                                    <input
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                        Phone (optional)
                                    </label>
                                    <input
                                        className="input-field"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+998 XX XXX XX XX"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                        Experience Level *
                                    </label>
                                    <select
                                        className="input-field"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    >
                                        <option value="beginner">Beginner (0-500 hours)</option>
                                        <option value="intermediate">Intermediate (500-2000 hours)</option>
                                        <option value="advanced">Advanced (2000+ hours)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                        Preferred Time *
                                    </label>
                                    <select
                                        className="input-field"
                                        value={formData.preferredTime}
                                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    >
                                        <option value="morning">Morning (9:00 - 12:00)</option>
                                        <option value="afternoon">Afternoon (14:00 - 17:00)</option>
                                        <option value="evening">Evening (19:00 - 22:00)</option>
                                        <option value="weekend">Weekend Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>
                                        Message (optional)
                                    </label>
                                    <textarea
                                        className="input-field"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your goals..."
                                        rows={3}
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                    Submit Application
                                </button>
                                <button type="button" className="btn-ghost" onClick={() => { playClick(); setShowForm(false); }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
