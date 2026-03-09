import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  scores: defineTable({
    danceStyle: v.string(), description: v.optional(v.string()),
    overallScore: v.number(),
    breakdown: v.array(v.object({ category: v.string(), score: v.number(), feedback: v.string() })),
    highlights: v.array(v.string()), improvements: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
