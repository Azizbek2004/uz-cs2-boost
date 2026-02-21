import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            avatarUrl: args.avatarUrl,
            isPremium: false,
            audioEnabled: true,
            theme: "dark",
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

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            isPremium: false,
            audioEnabled: true,
            theme: "dark",
        });
    },
});
