import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get top leaderboard entries (real-time subscription)
export const getTop = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        const entries = await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_elo")
            .order("desc")
            .take(limit);
        return entries;
    },
});

// Get leaderboard entry for a specific user
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();
    },
});

// Update or create leaderboard entry
export const upsert = mutation({
    args: {
        userId: v.id("users"),
        playerName: v.string(),
        faceitElo: v.number(),
        faceitLevel: v.number(),
        wins: v.number(),
        losses: v.number(),
        winRate: v.number(),
        avgKd: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("leaderboardEntries")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args,
                lastUpdated: Date.now(),
            });
            return existing._id;
        }

        return await ctx.db.insert("leaderboardEntries", {
            ...args,
            lastUpdated: Date.now(),
        });
    },
});
