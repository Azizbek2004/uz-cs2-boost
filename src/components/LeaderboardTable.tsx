"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  _id: string;
  playerName: string;
  faceitElo: number;
  faceitLevel: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKd: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
}

type SortKey = "faceitElo" | "winRate" | "avgKd" | "wins";

const LEVEL_COLORS: Record<number, string> = {
  1: "#999",
  2: "#90caf9",
  3: "#66bb6a",
  4: "#66bb6a",
  5: "#ffa726",
  6: "#ffa726",
  7: "#ef5350",
  8: "#ef5350",
  9: "#ab47bc",
  10: "#ffd700",
};

export default function LeaderboardTable({
  entries,
  loading,
}: LeaderboardTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("faceitElo");
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...entries].sort((a, b) => {
    const val = sortDesc ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
    return val;
  });

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(true);
    }
  };

  const SortHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: SortKey;
  }) => (
    <th
      onClick={() => handleSort(sortKey)}
      style={{
        padding: "12px 16px",
        textAlign: "left",
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: sortBy === sortKey ? "#ff6b00" : "#888",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        borderBottom: "1px solid #333",
      }}
    >
      {label} {sortBy === sortKey && (sortDesc ? "↓" : "↑")}
    </th>
  );

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
        <div
          className="loading-bar"
          style={{ width: "200px", margin: "0 auto 16px" }}
        />
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                borderBottom: "1px solid #333",
              }}
            >
              #
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                borderBottom: "1px solid #333",
              }}
            >
              Player
            </th>
            <SortHeader label="Elo" sortKey="faceitElo" />
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                borderBottom: "1px solid #333",
              }}
            >
              Level
            </th>
            <SortHeader label="Wins" sortKey="wins" />
            <SortHeader label="Win %" sortKey="winRate" />
            <SortHeader label="K/D" sortKey="avgKd" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, index) => (
            <motion.tr
              key={entry._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              style={{
                borderBottom: "1px solid rgba(51,51,51,0.5)",
                background: index < 3 ? "rgba(255,107,0,0.04)" : "transparent",
              }}
            >
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{
                    fontWeight: index < 3 ? "700" : "400",
                    color:
                      index === 0
                        ? "#ffd700"
                        : index === 1
                          ? "#c0c0c0"
                          : index === 2
                            ? "#cd7f32"
                            : "#888",
                  }}
                >
                  {index + 1}
                </span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {entry.playerName}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  color: "#ff6b00",
                  fontWeight: "700",
                }}
              >
                {entry.faceitElo}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "24px",
                    height: "24px",
                    borderRadius: "4px",
                    background: LEVEL_COLORS[entry.faceitLevel] || "#888",
                    textAlign: "center",
                    lineHeight: "24px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: entry.faceitLevel >= 9 ? "#000" : "#fff",
                  }}
                >
                  {entry.faceitLevel}
                </span>
              </td>
              <td style={{ padding: "12px 16px", color: "#aaa" }}>
                {entry.wins}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{ color: entry.winRate >= 50 ? "#00c853" : "#ff1744" }}
                >
                  {entry.winRate.toFixed(1)}%
                </span>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <span
                  style={{ color: entry.avgKd >= 1.0 ? "#00c853" : "#ff1744" }}
                >
                  {entry.avgKd.toFixed(2)}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
          No entries yet. Link your FACEIT account to appear on the leaderboard!
        </div>
      )}
    </div>
  );
}
