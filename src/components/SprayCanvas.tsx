"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";

// CS2 Spray Patterns (simplified recoil data - x,y offsets per bullet)
const SPRAY_PATTERNS: Record<string, { x: number; y: number }[]> = {
    "AK-47": [
        { x: 0, y: -1 }, { x: 0, y: -3 }, { x: 0, y: -6 }, { x: 0, y: -10 },
        { x: 0, y: -15 }, { x: -2, y: -19 }, { x: -4, y: -23 }, { x: -6, y: -26 },
        { x: -4, y: -29 }, { x: -1, y: -31 }, { x: 3, y: -33 }, { x: 7, y: -34 },
        { x: 10, y: -35 }, { x: 12, y: -35 }, { x: 13, y: -34 }, { x: 10, y: -33 },
        { x: 6, y: -32 }, { x: 2, y: -31 }, { x: -3, y: -31 }, { x: -8, y: -32 },
        { x: -12, y: -33 }, { x: -14, y: -34 }, { x: -13, y: -35 }, { x: -10, y: -36 },
        { x: -6, y: -37 }, { x: -2, y: -38 }, { x: 3, y: -39 }, { x: 8, y: -40 },
        { x: 12, y: -41 }, { x: 14, y: -42 },
    ],
    "M4A4": [
        { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -5 }, { x: 0, y: -8 },
        { x: 0, y: -12 }, { x: -1, y: -16 }, { x: -3, y: -19 }, { x: -5, y: -22 },
        { x: -3, y: -25 }, { x: 0, y: -27 }, { x: 3, y: -28 }, { x: 6, y: -29 },
        { x: 8, y: -29 }, { x: 9, y: -28 }, { x: 8, y: -27 }, { x: 5, y: -26 },
        { x: 2, y: -25 }, { x: -2, y: -25 }, { x: -5, y: -26 }, { x: -8, y: -27 },
        { x: -10, y: -28 }, { x: -9, y: -29 }, { x: -7, y: -30 }, { x: -4, y: -31 },
        { x: 0, y: -32 }, { x: 4, y: -33 }, { x: 7, y: -34 }, { x: 9, y: -35 },
        { x: 10, y: -36 }, { x: 9, y: -37 },
    ],
    "M4A1-S": [
        { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -4 }, { x: 0, y: -7 },
        { x: 0, y: -10 }, { x: -1, y: -13 }, { x: -2, y: -16 }, { x: -3, y: -18 },
        { x: -2, y: -20 }, { x: 0, y: -22 }, { x: 2, y: -23 }, { x: 4, y: -24 },
        { x: 5, y: -24 }, { x: 5, y: -23 }, { x: 4, y: -22 }, { x: 2, y: -21 },
        { x: 0, y: -20 }, { x: -2, y: -20 }, { x: -4, y: -21 }, { x: -5, y: -22 },
        { x: -5, y: -23 }, { x: -4, y: -24 }, { x: -2, y: -25 }, { x: 0, y: -26 },
        { x: 2, y: -27 },
    ],
};

const WEAPONS = Object.keys(SPRAY_PATTERNS);
const SCALE = 5;
const TARGET_RADIUS = 12;

interface SprayCanvasProps {
    onScoreUpdate?: (score: number, accuracy: number) => void;
}

export default function SprayCanvas({ onScoreUpdate }: SprayCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedWeapon, setSelectedWeapon] = useState("AK-47");
    const [showPattern, setShowPattern] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [currentBullet, setCurrentBullet] = useState(0);
    const [score, setScore] = useState(0);
    const [hits, setHits] = useState<{ x: number; y: number; close: boolean }[]>([]);
    const [sessionComplete, setSessionComplete] = useState(false);
    const { playHit, playClick, playVictory } = useAudio();

    const pattern = SPRAY_PATTERNS[selectedWeapon];
    const centerX = 300;
    const centerY = 350;

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let j = 0; j < canvas.height; j += 30) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(canvas.width, j);
            ctx.stroke();
        }

        // Draw crosshair at center
        ctx.strokeStyle = "rgba(0, 255, 0, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY);
        ctx.lineTo(centerX + 15, centerY);
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX, centerY + 15);
        ctx.stroke();

        // Draw pattern guide if enabled
        if (showPattern) {
            pattern.forEach((point, i) => {
                const x = centerX + point.x * SCALE;
                const y = centerY + point.y * SCALE;

                ctx.beginPath();
                ctx.arc(x, y, TARGET_RADIUS, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 107, 0, ${0.2 + (i / pattern.length) * 0.5})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Number label
                ctx.fillStyle = "rgba(255, 107, 0, 0.6)";
                ctx.font = "10px Inter";
                ctx.textAlign = "center";
                ctx.fillText(String(i + 1), x, y + 3);
            });

            // Draw connecting lines
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 107, 0, 0.15)";
            ctx.lineWidth = 1;
            pattern.forEach((point, i) => {
                const x = centerX + point.x * SCALE;
                const y = centerY + point.y * SCALE;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }

        // Draw current target (next bullet position)
        if (isTraining && currentBullet < pattern.length) {
            const target = pattern[currentBullet];
            const tx = centerX + target.x * SCALE;
            const ty = centerY + target.y * SCALE;

            // Pulsing target
            ctx.beginPath();
            ctx.arc(tx, ty, TARGET_RADIUS + 4, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(0, 200, 83, 0.5)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(tx, ty, TARGET_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 200, 83, 0.15)";
            ctx.fill();
            ctx.strokeStyle = "#00c853";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw player hits
        hits.forEach((hit) => {
            ctx.beginPath();
            ctx.arc(hit.x, hit.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = hit.close ? "#00c853" : "#ff1744";
            ctx.fill();

            // Impact ring
            ctx.beginPath();
            ctx.arc(hit.x, hit.y, 6, 0, Math.PI * 2);
            ctx.strokeStyle = hit.close ? "rgba(0,200,83,0.3)" : "rgba(255,23,68,0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Score display
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "left";
        ctx.fillText(`Bullet: ${currentBullet}/${pattern.length}`, 16, 30);
        ctx.fillText(`Score: ${score}`, 16, 50);

        if (sessionComplete) {
            const accuracy = pattern.length > 0 ? Math.round((score / (pattern.length * 100)) * 100) : 0;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ff6b00";
            ctx.font = "bold 28px Orbitron, Inter";
            ctx.textAlign = "center";
            ctx.fillText("SESSION COMPLETE", centerX, centerY - 30);
            ctx.fillStyle = "white";
            ctx.font = "bold 20px Inter";
            ctx.fillText(`Score: ${score} / ${pattern.length * 100}`, centerX, centerY + 10);
            ctx.fillText(`Accuracy: ${accuracy}%`, centerX, centerY + 40);
        }
    }, [showPattern, isTraining, currentBullet, score, hits, pattern, sessionComplete, centerX, centerY]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isTraining || sessionComplete) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        if (currentBullet >= pattern.length) return;

        const target = pattern[currentBullet];
        const tx = centerX + target.x * SCALE;
        const ty = centerY + target.y * SCALE;

        const distance = Math.sqrt((x - tx) ** 2 + (y - ty) ** 2);
        const isClose = distance <= TARGET_RADIUS * 2;
        const bulletScore = isClose ? Math.max(0, Math.round(100 - distance * 2)) : 0;

        playHit();

        const newHits = [...hits, { x, y, close: isClose }];
        const newScore = score + bulletScore;
        const newBullet = currentBullet + 1;

        setHits(newHits);
        setScore(newScore);
        setCurrentBullet(newBullet);

        if (newBullet >= pattern.length) {
            setSessionComplete(true);
            const accuracy = Math.round((newScore / (pattern.length * 100)) * 100);
            playVictory();
            onScoreUpdate?.(newScore, accuracy);
        }
    };

    const startTraining = () => {
        playClick();
        setIsTraining(true);
        setCurrentBullet(0);
        setScore(0);
        setHits([]);
        setSessionComplete(false);
    };

    const resetTraining = () => {
        playClick();
        setIsTraining(false);
        setCurrentBullet(0);
        setScore(0);
        setHits([]);
        setSessionComplete(false);
    };

    return (
        <div>
            {/* Controls */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "20px",
                    alignItems: "center",
                }}
            >
                <select
                    value={selectedWeapon}
                    onChange={(e) => {
                        setSelectedWeapon(e.target.value);
                        resetTraining();
                    }}
                    className="input-field"
                    style={{ maxWidth: "180px" }}
                >
                    {WEAPONS.map((w) => (
                        <option key={w} value={w}>
                            {w}
                        </option>
                    ))}
                </select>

                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        color: "#aaa",
                        fontSize: "14px",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={showPattern}
                        onChange={(e) => setShowPattern(e.target.checked)}
                        style={{ accentColor: "#ff6b00" }}
                    />
                    Show Pattern Guide
                </label>

                {!isTraining ? (
                    <button className="btn-primary" onClick={startTraining}>
                        Start Training
                    </button>
                ) : (
                    <button className="btn-secondary" onClick={resetTraining}>
                        Reset
                    </button>
                )}
            </div>

            {/* Canvas */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #333",
                    position: "relative",
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={500}
                    onClick={handleCanvasClick}
                    className="crosshair-cursor"
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        height: "auto",
                        display: "block",
                        background: "#111",
                    }}
                />
            </motion.div>

            {/* Tips */}
            <AnimatePresence>
                {isTraining && !sessionComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            marginTop: "12px",
                            padding: "12px 16px",
                            background: "rgba(255,107,0,0.08)",
                            border: "1px solid rgba(255,107,0,0.2)",
                            borderRadius: "8px",
                            fontSize: "13px",
                            color: "#ff8c33",
                        }}
                    >
                        💡 Click where the next bullet should land. Green circle = target position.
                        {selectedWeapon === "AK-47" && " The AK-47 pulls up then sweeps left-right."}
                        {selectedWeapon === "M4A4" && " The M4A4 has a more vertical pattern."}
                        {selectedWeapon === "M4A1-S" && " The M4A1-S has a tight, controlled spray."}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
