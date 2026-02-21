import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit academy signup
export const submit = mutation({
    args: {
        userId: v.optional(v.id("users")),
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        experience: v.string(),
        preferredTime: v.string(),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("academySignups", {
            ...args,
            status: "pending",
            createdAt: Date.now(),
        });
    },
});

// Get signups (admin)
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("academySignups").order("desc").take(50);
    },
});
