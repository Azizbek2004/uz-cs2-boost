import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) return null;
        return await ctx.db.get(userId);
    },
});

export const update = mutation({
    args: {
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        steamId: v.optional(v.string()),
        faceitId: v.optional(v.string()),
        faceitNickname: v.optional(v.string()),
        faceitElo: v.optional(v.number()),
        faceitLevel: v.optional(v.number()),
        isPrime: v.optional(v.boolean()),
        isp: v.optional(v.string()),
        city: v.optional(v.string()),
        audioEnabled: v.optional(v.boolean()),
        theme: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) throw new Error("Not authenticated");
        const filtered = Object.fromEntries(
            Object.entries(args).filter(([, val]) => val !== undefined)
        );
        await ctx.db.patch(userId, filtered);
    },
});


// Get user by email
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

// Get user by ID
export const getById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// Create new user
export const create = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        const today = new Date().toISOString().split("T")[0];

        if (existing) {
            // Update login streak logic
            const lastLogin = existing.lastLoginDate;
            let streak = existing.loginStreak || 0;
            let balance = existing.uzsBalance || 0;

            if (lastLogin !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split("T")[0];

                if (lastLogin === yesterdayStr) {
                    streak += 1;
                    if (streak === 1) balance += 50; // Day 1 reward
                    // Future: Day 3, Day 7 rewards logic
                } else {
                    streak = 1; // Reset streak
                    balance += 50; // Day 1 reward
                }

                await ctx.db.patch(existing._id, {
                    lastLoginDate: today,
                    loginStreak: streak,
                    uzsBalance: balance,
                });
            }

            return existing._id;
        }

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            avatarUrl: args.avatarUrl,
            isPremium: false,
            audioEnabled: true,
            theme: "dark",
            uzsBalance: 50, // Initial bonus
            rank: "Novice",
            loginStreak: 1,
            lastLoginDate: today,
            skillPoints: {
                aim: 0,
                spray: 0,
                movement: 0,
                utility: 0,
                gameSense: 0,
            }
        });
    },
});

// Update user profile
export const updateProfile = mutation({
    args: {
        userId: v.id("users"),
        name: v.optional(v.string()),
        steamId: v.optional(v.string()),
        faceitId: v.optional(v.string()),
        faceitNickname: v.optional(v.string()),
        faceitElo: v.optional(v.number()),
        faceitLevel: v.optional(v.number()),
        isPrime: v.optional(v.boolean()),
        isp: v.optional(v.string()),
        city: v.optional(v.string()),
        audioEnabled: v.optional(v.boolean()),
        theme: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;
        // Filter out undefined values
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, v]) => v !== undefined)
        );
        await ctx.db.patch(userId, filtered);
    },
});

// Update Gamification stats (Skills, Rank, UZS)
export const updateGamification = mutation({
    args: {
        userId: v.id("users"),
        uzsBalance: v.optional(v.number()),
        rank: v.optional(v.string()),
        skillPoints: v.optional(v.object({
            aim: v.number(),
            spray: v.number(),
            movement: v.number(),
            utility: v.number(),
            gameSense: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        const { userId, ...updates } = args;
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, v]) => v !== undefined)
        );
        await ctx.db.patch(userId, filtered);
    }
});

// Upgrade to premium
export const upgradeToPremium = mutation({
    args: {
        userId: v.id("users"),
        stripeCustomerId: v.string(),
        stripeSubscriptionId: v.string(),
        premiumExpiresAt: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            isPremium: true,
            stripeCustomerId: args.stripeCustomerId,
            stripeSubscriptionId: args.stripeSubscriptionId,
            premiumExpiresAt: args.premiumExpiresAt,
        });
    },
});

// Simple login (email-based for demo)
export const login = mutation({
    args: {
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        const today = new Date().toISOString().split("T")[0];

        if (existing) {
            // Update login streak logic
            const lastLogin = existing.lastLoginDate;
            let streak = existing.loginStreak || 0;
            let balance = existing.uzsBalance || 0;

            if (lastLogin !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split("T")[0];

                if (lastLogin === yesterdayStr) {
                    streak += 1;
                    if (streak === 1) balance += 50; // Day 1 reward
                } else {
                    streak = 1; // Reset streak
                    balance += 50; // Day 1 reward
                }

                await ctx.db.patch(existing._id, {
                    lastLoginDate: today,
                    loginStreak: streak,
                    uzsBalance: balance,
                });
            }
            return existing._id;
        }

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            isPremium: false,
            audioEnabled: true,
            theme: "dark",
            uzsBalance: 50,
            rank: "Novice",
            loginStreak: 1,
            lastLoginDate: today,
            skillPoints: {
                aim: 0,
                spray: 0,
                movement: 0,
                utility: 0,
                gameSense: 0,
            }
        });
    },
});
