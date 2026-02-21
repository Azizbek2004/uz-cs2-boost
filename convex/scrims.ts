import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get open scrims
export const getOpen = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("scrims")
            .withIndex("by_status", (q) => q.eq("status", "open"))
            .order("desc")
            .take(20);
    },
});

// Get all scrims
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("scrims").order("desc").take(50);
    },
});

// Create a scrim
export const create = mutation({
    args: {
        creatorId: v.id("users"),
        creatorName: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        minElo: v.number(),
        maxElo: v.number(),
        mapPool: v.array(v.string()),
        maxPlayers: v.number(),
        scheduledAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("scrims", {
            ...args,
            currentPlayers: [args.creatorId],
            status: "open",
            createdAt: Date.now(),
        });
    },
});

// Join a scrim
export const join = mutation({
    args: {
        scrimId: v.id("scrims"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const scrim = await ctx.db.get(args.scrimId);
        if (!scrim) throw new Error("Scrim not found");
        if (scrim.status !== "open") throw new Error("Scrim is not open");
        if (scrim.currentPlayers.includes(args.userId))
            throw new Error("Already joined");
        if (scrim.currentPlayers.length >= scrim.maxPlayers)
            throw new Error("Scrim is full");

        const newPlayers = [...scrim.currentPlayers, args.userId];
        await ctx.db.patch(args.scrimId, {
            currentPlayers: newPlayers,
            status: newPlayers.length >= scrim.maxPlayers ? "full" : "open",
        });
    },
});

// Leave a scrim
export const leave = mutation({
    args: {
        scrimId: v.id("scrims"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const scrim = await ctx.db.get(args.scrimId);
        if (!scrim) throw new Error("Scrim not found");

        const newPlayers = scrim.currentPlayers.filter((id) => id !== args.userId);
        await ctx.db.patch(args.scrimId, {
            currentPlayers: newPlayers,
            status: "open",
        });
    },
});
