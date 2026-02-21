import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all tournaments
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tournaments").order("desc").take(20);
    },
});

// Get upcoming tournaments
export const getUpcoming = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("tournaments")
            .withIndex("by_status", (q) => q.eq("status", "upcoming"))
            .order("desc")
            .take(10);
    },
});

// Get open registration tournaments
export const getOpenRegistration = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("tournaments")
            .withIndex("by_status", (q) => q.eq("status", "registration"))
            .order("desc")
            .take(10);
    },
});

// Create tournament
export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        format: v.string(),
        prizePool: v.optional(v.string()),
        maxTeams: v.number(),
        startDate: v.number(),
        endDate: v.optional(v.number()),
        rules: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournaments", {
            ...args,
            registeredTeams: [],
            status: "upcoming",
            createdAt: Date.now(),
        });
    },
});

// Register team for tournament
export const registerTeam = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        teamName: v.string(),
        captainId: v.id("users"),
        players: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const tournament = await ctx.db.get(args.tournamentId);
        if (!tournament) throw new Error("Tournament not found");
        if (
            tournament.status !== "registration" &&
            tournament.status !== "upcoming"
        )
            throw new Error("Registration not open");
        if (tournament.registeredTeams.length >= tournament.maxTeams)
            throw new Error("Tournament is full");

        await ctx.db.patch(args.tournamentId, {
            registeredTeams: [
                ...tournament.registeredTeams,
                {
                    teamName: args.teamName,
                    captainId: args.captainId,
                    players: args.players,
                },
            ],
        });
    },
});
