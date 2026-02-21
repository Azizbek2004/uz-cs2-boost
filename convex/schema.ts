import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    // Auth
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    passwordHash: v.optional(v.string()),

    // Gaming profiles
    steamId: v.optional(v.string()),
    faceitId: v.optional(v.string()),
    faceitNickname: v.optional(v.string()),
    faceitElo: v.optional(v.number()),
    faceitLevel: v.optional(v.number()),
    isPrime: v.optional(v.boolean()),

    // Local info
    isp: v.optional(v.string()),
    city: v.optional(v.string()),

    // Subscription
    isPremium: v.boolean(),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    premiumExpiresAt: v.optional(v.number()),

    // Preferences
    audioEnabled: v.optional(v.boolean()),
    theme: v.optional(v.string()),

    // Gamification & Progression (Phase 7)
    uzsBalance: v.optional(v.number()),
    rank: v.optional(v.string()), // "Novice", "Soldier", "Veteran", "Master", "Legend"
    loginStreak: v.optional(v.number()),
    lastLoginDate: v.optional(v.string()), // YYYY-MM-DD to track daily streaks
    skillPoints: v.optional(
      v.object({
        aim: v.number(),
        spray: v.number(),
        movement: v.number(),
        utility: v.number(),
        gameSense: v.number(),
      })
    ),
  })
    .index("by_email", ["email"])
    .index("by_steamId", ["steamId"])
    .index("by_faceitId", ["faceitId"]),

  leaderboardEntries: defineTable({
    userId: v.id("users"),
    playerName: v.string(),
    faceitElo: v.number(),
    faceitLevel: v.number(),
    wins: v.number(),
    losses: v.number(),
    winRate: v.number(),
    avgKd: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_elo", ["faceitElo"])
    .index("by_userId", ["userId"]),

  scrims: defineTable({
    creatorId: v.id("users"),
    creatorName: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    minElo: v.number(),
    maxElo: v.number(),
    mapPool: v.array(v.string()),
    maxPlayers: v.number(),
    currentPlayers: v.array(v.id("users")),
    status: v.union(
      v.literal("open"),
      v.literal("full"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    scheduledAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_creatorId", ["creatorId"]),

  tournaments: defineTable({
    title: v.string(),
    description: v.string(),
    format: v.string(),
    prizePool: v.optional(v.string()),
    maxTeams: v.number(),
    registeredTeams: v.array(
      v.object({
        teamName: v.string(),
        captainId: v.id("users"),
        players: v.array(v.id("users")),
      })
    ),
    status: v.union(
      v.literal("upcoming"),
      v.literal("registration"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    rules: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  sprayScores: defineTable({
    userId: v.id("users"),
    weapon: v.string(),
    score: v.number(),
    accuracy: v.number(),
    pattern: v.string(),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_weapon_score", ["weapon", "score"]),

  pingResults: defineTable({
    userId: v.id("users"),
    avgPing: v.number(),
    minPing: v.number(),
    maxPing: v.number(),
    jitter: v.number(),
    packetLoss: v.number(),
    isp: v.optional(v.string()),
    server: v.string(),
    timestamp: v.number(),
    suggestions: v.array(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  academySignups: defineTable({
    userId: v.optional(v.id("users")),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    experience: v.string(),
    preferredTime: v.string(),
    message: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});
