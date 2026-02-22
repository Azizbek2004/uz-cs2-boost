import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── Public query: get all skins for a specific weapon ─────────────────────
export const getSkinsByWeapon = query({
    args: { weaponId: v.string() },
    handler: async (ctx, { weaponId }) => {
        return await ctx.db
            .query("skins")
            .withIndex("by_weapon", (q) => q.eq("weaponId", weaponId))
            .collect();
    },
});

// ── Public query: get all skins (for browsing the full catalog) ───────────
export const getAllSkins = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("skins").collect();
    },
});

// ── Authenticated query: get current user's saved loadout ─────────────────
export const getUserLoadout = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        return user?.savedLoadout ?? [];
    },
});

// ── Authenticated mutation: save full loadout to user profile ─────────────
export const saveUserLoadout = mutation({
    args: {
        loadout: v.array(
            v.object({
                weaponId: v.string(),
                paintIndex: v.number(),
                seed: v.number(),
                wear: v.number(),
                statTrak: v.optional(v.boolean()),
                nameTag: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, { loadout }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Validate each entry
        for (const entry of loadout) {
            if (entry.seed < 0 || entry.seed > 999) {
                throw new Error(`Invalid seed ${entry.seed}: must be 0-999`);
            }
            if (entry.wear < 0 || entry.wear > 1) {
                throw new Error(`Invalid wear ${entry.wear}: must be 0.0-1.0`);
            }
        }

        await ctx.db.patch(userId, { savedLoadout: loadout });
        return { success: true };
    },
});

// ── Authenticated mutation: add a single skin to the loadout ──────────────
export const addSkinToLoadout = mutation({
    args: {
        weaponId: v.string(),
        paintIndex: v.number(),
        seed: v.number(),
        wear: v.number(),
        statTrak: v.optional(v.boolean()),
        nameTag: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Validate
        if (args.seed < 0 || args.seed > 999) {
            throw new Error(`Invalid seed: must be 0-999`);
        }
        if (args.wear < 0 || args.wear > 1) {
            throw new Error(`Invalid wear: must be 0.0-1.0`);
        }

        const user = await ctx.db.get(userId);
        const currentLoadout = user?.savedLoadout ?? [];

        // Replace existing skin for the same weapon, or add new
        const existingIndex = currentLoadout.findIndex(
            (s) => s.weaponId === args.weaponId
        );

        const newEntry = {
            weaponId: args.weaponId,
            paintIndex: args.paintIndex,
            seed: args.seed,
            wear: args.wear,
            statTrak: args.statTrak,
            nameTag: args.nameTag,
        };

        if (existingIndex >= 0) {
            currentLoadout[existingIndex] = newEntry;
        } else {
            currentLoadout.push(newEntry);
        }

        await ctx.db.patch(userId, { savedLoadout: currentLoadout });
        return { success: true };
    },
});

// ── Authenticated mutation: remove a skin from the loadout ────────────────
export const removeSkinFromLoadout = mutation({
    args: { weaponId: v.string() },
    handler: async (ctx, { weaponId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const user = await ctx.db.get(userId);
        const currentLoadout = user?.savedLoadout ?? [];

        const updated = currentLoadout.filter((s) => s.weaponId !== weaponId);
        await ctx.db.patch(userId, { savedLoadout: updated });
        return { success: true };
    },
});
