import { action } from "./_generated/server";
import { v } from "convex/values";

// Fetch FACEIT player stats
export const getPlayerStats = action({
    args: { nickname: v.string() },
    handler: async (_, args) => {
        const apiKey = process.env.FACEIT_API_KEY;
        if (!apiKey) {
            // Return mock data if no API key
            return {
                player_id: "mock-id",
                nickname: args.nickname,
                games: {
                    cs2: {
                        faceit_elo: 1500 + Math.floor(Math.random() * 500),
                        skill_level: Math.floor(Math.random() * 10) + 1,
                    },
                },
                country: "UZ",
                avatar: "",
                membership_type: "free",
            };
        }

        try {
            const response = await fetch(
                `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(args.nickname)}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`FACEIT API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("FACEIT API error:", error);
            throw new Error("Failed to fetch FACEIT data");
        }
    },
});

// Fetch FACEIT player match history
export const getMatchHistory = action({
    args: { playerId: v.string(), limit: v.optional(v.number()) },
    handler: async (_, args) => {
        const apiKey = process.env.FACEIT_API_KEY;
        const limit = args.limit ?? 20;

        if (!apiKey) {
            // Mock data
            return {
                items: Array.from({ length: limit }, (_, i) => ({
                    match_id: `mock-match-${i}`,
                    game_id: "cs2",
                    started_at: Date.now() - i * 3600000,
                    finished_at: Date.now() - i * 3600000 + 2400000,
                    results: {
                        score: { faction1: Math.floor(Math.random() * 16), faction2: Math.floor(Math.random() * 16) },
                    },
                    teams: {
                        faction1: { name: "Team Alpha" },
                        faction2: { name: "Team Bravo" },
                    },
                })),
            };
        }

        try {
            const response = await fetch(
                `https://open.faceit.com/data/v4/players/${args.playerId}/history?game=cs2&offset=0&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`FACEIT API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("FACEIT match history error:", error);
            throw new Error("Failed to fetch match history");
        }
    },
});
