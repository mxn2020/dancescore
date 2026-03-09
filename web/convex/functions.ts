import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveScore = mutation({
  args: { danceStyle: v.string(), description: v.optional(v.string()), overallScore: v.number(), breakdown: v.array(v.object({ category: v.string(), score: v.number(), feedback: v.string() })), highlights: v.array(v.string()), improvements: v.array(v.string()) },
  handler: async (ctx, args) => await ctx.db.insert("scores", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("scores").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
