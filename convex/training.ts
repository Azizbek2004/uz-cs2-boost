import { v } from "convex/values";
import { action, query, internalMutation, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// ── Available port range for training rooms ───────────────────────────────
const PORT_RANGE_START = 27020;
const PORT_RANGE_END = 27030;

// ── Query: Get all training rooms for the current user ────────────────────
export const getUserRooms = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        return await ctx.db
            .query("trainingRooms")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
    },
});

// ── Query: Get active rooms (to determine port availability) ──────────────
export const getActiveRooms = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("trainingRooms")
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect();
    },
});

// ── Internal mutation: Create training room record ────────────────────────
export const createRoom = internalMutation({
    args: {
        userId: v.id("users"),
        mapName: v.string(),
        configName: v.string(),
        serverPort: v.number(),
        rconPassword: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("trainingRooms", {
            userId: args.userId,
            status: args.status,
            serverPort: args.serverPort,
            mapName: args.mapName,
            configName: args.configName,
            startedAt: Date.now(),
            rconPassword: args.rconPassword,
        });
    },
});

// ── Internal mutation: Update training room status ────────────────────────
export const updateRoomStatus = internalMutation({
    args: {
        roomId: v.id("trainingRooms"),
        status: v.string(),
        stoppedAt: v.optional(v.number()),
    },
    handler: async (ctx, { roomId, status, stoppedAt }) => {
        const patch: Record<string, unknown> = { status };
        if (stoppedAt) patch.stoppedAt = stoppedAt;
        await ctx.db.patch(roomId, patch);
    },
});

// ── Action: Provision a training room ─────────────────────────────────────
export const provisionTrainingRoom = action({
    args: {
        mapName: v.string(),
        configName: v.string(),
    },
    handler: async (ctx, { mapName, configName }): Promise<{
        success: boolean;
        port: number;
        rconPassword: string;
        roomId: string;
        note?: string;
    }> => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Find available port
        const activeRooms = await ctx.runQuery(internal.training.getActiveRooms as any, {});
        const usedPorts = new Set(
            (activeRooms as Array<{ serverPort?: number }>)
                .map((r) => r.serverPort)
                .filter(Boolean)
        );

        let availablePort: number | null = null;
        for (let port = PORT_RANGE_START; port <= PORT_RANGE_END; port++) {
            if (!usedPorts.has(port)) {
                availablePort = port;
                break;
            }
        }

        if (!availablePort) {
            throw new Error("No available server ports. Please try again later.");
        }

        // Generate RCON password
        const rconPassword = Math.random().toString(36).substring(2, 14);

        // Create room record in "provisioning" state
        const roomId = await ctx.runMutation(internal.training.createRoom, {
            userId,
            mapName,
            configName,
            serverPort: availablePort,
            rconPassword,
            status: "provisioning",
        });

        // Call the Kamatera daemon to provision the server
        try {
            const DAEMON_URL = process.env.KAMATERA_DAEMON_URL;
            const DAEMON_SECRET = process.env.KAMATERA_DAEMON_SECRET;

            if (!DAEMON_URL || !DAEMON_SECRET) {
                // If daemon is not configured, simulate success for development
                await ctx.runMutation(internal.training.updateRoomStatus, {
                    roomId,
                    status: "active",
                });
                return {
                    success: true,
                    port: availablePort,
                    rconPassword,
                    roomId,
                    note: "Daemon not configured — room marked active for development.",
                };
            }

            const response = await fetch(`${DAEMON_URL}/provision`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DAEMON_SECRET}`,
                },
                body: JSON.stringify({
                    userId: userId.toString(),
                    mapName,
                    configName,
                    port: availablePort,
                    rconPassword,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                await ctx.runMutation(internal.training.updateRoomStatus, {
                    roomId,
                    status: "error",
                });
                throw new Error(`Server provision failed: ${errorText}`);
            }

            // Success — mark as active
            await ctx.runMutation(internal.training.updateRoomStatus, {
                roomId,
                status: "active",
            });

            return { success: true, port: availablePort, rconPassword, roomId };
        } catch (error) {
            await ctx.runMutation(internal.training.updateRoomStatus, {
                roomId,
                status: "error",
            });
            throw error;
        }
    },
});

// ── Action: Stop a training room ──────────────────────────────────────────
export const stopTrainingRoom = action({
    args: {
        roomId: v.id("trainingRooms"),
    },
    handler: async (ctx, { roomId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Get the room
        const room = await ctx.runQuery(internal.training.getRoomById as any, { roomId });
        if (!room) throw new Error("Training room not found");
        if (room.userId !== userId) throw new Error("Not authorized");
        if (room.status !== "active") throw new Error("Room is not active");

        try {
            const DAEMON_URL = process.env.KAMATERA_DAEMON_URL;
            const DAEMON_SECRET = process.env.KAMATERA_DAEMON_SECRET;

            if (DAEMON_URL && DAEMON_SECRET && room.serverPort) {
                await fetch(`${DAEMON_URL}/stop`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${DAEMON_SECRET}`,
                    },
                    body: JSON.stringify({ port: room.serverPort }),
                });
            }

            await ctx.runMutation(internal.training.updateRoomStatus, {
                roomId,
                status: "stopped",
                stoppedAt: Date.now(),
            });

            return { success: true };
        } catch (error) {
            await ctx.runMutation(internal.training.updateRoomStatus, {
                roomId,
                status: "error",
            });
            throw error;
        }
    },
});

// ── Internal query: Get room by ID ────────────────────────────────────────
export const getRoomById = internalQuery({
    args: { roomId: v.id("trainingRooms") },
    handler: async (ctx, { roomId }) => {
        return await ctx.db.get(roomId);
    },
});
