import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

// ── Public HTTP endpoint: Get user's skin loadout by Steam ID ─────────────
// Used by the CS2 game server plugin to fetch a player's loadout
// URL: GET /api/loadout?steamId=<SteamID64>
http.route({
    path: "/api/loadout",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const url = new URL(request.url);
        const steamId = url.searchParams.get("steamId");

        if (!steamId) {
            return new Response(
                JSON.stringify({ error: "Missing steamId parameter", loadout: [] }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        try {
            // Look up user by steamId using the getBySteamId query
            const user = await ctx.runQuery(api.users.getBySteamId, { steamId });

            if (!user || !user.savedLoadout) {
                return new Response(
                    JSON.stringify({ loadout: [] }),
                    {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Cache-Control": "public, max-age=30",
                        },
                    }
                );
            }

            return new Response(
                JSON.stringify({ loadout: user.savedLoadout }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "public, max-age=30",
                    },
                }
            );
        } catch (error) {
            console.error("Loadout API error:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error", loadout: [] }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }
    }),
});

// CORS preflight handler for the loadout API
http.route({
    path: "/api/loadout",
    method: "OPTIONS",
    handler: httpAction(async () => {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }),
});

export default http;
