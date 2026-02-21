import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get ping results by user
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("pingResults")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(20);
    },
});

// Get recent ping results (for community stats)
export const getRecent = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        return await ctx.db
            .query("pingResults")
            .withIndex("by_timestamp")
            .order("desc")
            .take(limit);
    },
});

// Save ping result
export const save = mutation({
    args: {
        userId: v.id("users"),
        avgPing: v.number(),
        minPing: v.number(),
        maxPing: v.number(),
        jitter: v.number(),
        packetLoss: v.number(),
        isp: v.optional(v.string()),
        server: v.string(),
        suggestions: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("pingResults", {
            ...args,
            timestamp: Date.now(),
        });
    },
});
