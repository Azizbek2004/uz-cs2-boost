import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get scores by user
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("sprayScores")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(50);
    },
});

// Get top scores by weapon
export const getTopByWeapon = query({
    args: { weapon: v.string(), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        return await ctx.db
            .query("sprayScores")
            .withIndex("by_weapon_score", (q) => q.eq("weapon", args.weapon))
            .order("desc")
            .take(limit);
    },
});

// Save a spray score
export const save = mutation({
    args: {
        userId: v.id("users"),
        weapon: v.string(),
        score: v.number(),
        accuracy: v.number(),
        pattern: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("sprayScores", {
            ...args,
            timestamp: Date.now(),
        });
    },
});
