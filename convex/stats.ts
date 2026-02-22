import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";

// ── Internal mutation to update cached stats on user ──────────────────────
export const updateCachedStats = internalMutation({
    args: {
        userId: v.id("users"),
        stats: v.object({
            elo: v.optional(v.number()),
            level: v.optional(v.number()),
            winRate: v.optional(v.number()),
            kdRatio: v.optional(v.number()),
            lastUpdated: v.number(),
        }),
    },
    handler: async (ctx, { userId, stats }) => {
        await ctx.db.patch(userId, { cachedStats: stats });
    },
});

// ── Action: Fetch and cache user stats from FACEIT + Steam APIs ───────────
export const fetchAndCacheUserStats = action({
    args: {},
    handler: async (ctx): Promise<{
        elo?: number;
        level?: number;
        winRate?: number;
        kdRatio?: number;
        lastUpdated: number;
    }> => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Get user record to check cached stats and linked accounts
        const user = await ctx.runQuery(api.users.getById, { userId });
        if (!user) throw new Error("User not found");

        // Rate limit: skip if last update was less than 10 minutes ago
        const TEN_MINUTES = 10 * 60 * 1000;
        if (
            user.cachedStats?.lastUpdated &&
            Date.now() - user.cachedStats.lastUpdated < TEN_MINUTES
        ) {
            return user.cachedStats;
        }

        let elo: number | undefined;
        let level: number | undefined;
        let winRate: number | undefined;
        let kdRatio: number | undefined;

        // ── Fetch FACEIT stats ────────────────────────────────────────────
        if (user.faceitNickname || user.faceitId) {
            try {
                const FACEIT_API_KEY = process.env.FACEIT_DATA_API_KEY;
                if (FACEIT_API_KEY) {
                    const identifier = user.faceitNickname || user.faceitId;
                    const url = user.faceitNickname
                        ? `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(identifier!)}`
                        : `https://open.faceit.com/data/v4/players/${identifier}`;

                    const response = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${FACEIT_API_KEY}`,
                            Accept: "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const cs2Data = data.games?.cs2 || data.games?.csgo;
                        if (cs2Data) {
                            elo = cs2Data.faceit_elo;
                            level = cs2Data.skill_level;
                        }

                        // Fetch recent match stats for K/D and win rate
                        const playerId = data.player_id;
                        if (playerId) {
                            const statsUrl = `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`;
                            const statsResp = await fetch(statsUrl, {
                                headers: {
                                    Authorization: `Bearer ${FACEIT_API_KEY}`,
                                    Accept: "application/json",
                                },
                            });

                            if (statsResp.ok) {
                                const statsData = await statsResp.json();
                                const lifetime = statsData.lifetime;
                                if (lifetime) {
                                    winRate = parseFloat(lifetime["Win Rate %"]) || undefined;
                                    kdRatio = parseFloat(lifetime["Average K/D Ratio"]) || undefined;
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("FACEIT API fetch failed:", error);
                // Continue with partial data
            }
        }

        // ── Build stats object and cache ──────────────────────────────────
        const stats = {
            elo,
            level,
            winRate,
            kdRatio,
            lastUpdated: Date.now(),
        };

        // Save to user record
        await ctx.runMutation(internal.stats.updateCachedStats, {
            userId,
            stats,
        });

        return stats;
    },
});
