import { action } from "./_generated/server";
import { v } from "convex/values";
export const analyzePerformance = action({
    args: { danceStyle: v.string(), description: v.optional(v.string()), imageBase64: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const userContent: any[] = [{
            type: "text", text: `Analyze this ${args.danceStyle} dance performance.${args.description ? ` Details: ${args.description}` : ''} Output JSON:
{"overallScore":<1-10>,"breakdown":[{"category":"Rhythm|Technique|Expression|Posture|Creativity|Musicality","score":<1-10>,"feedback":""}],"highlights":[""],"improvements":[""]}` }];
        if (args.imageBase64) userContent.push({ type: "image_url", image_url: { url: args.imageBase64 } });
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    { role: "system", content: "You are DanceScore, a professional dance judge. Score performances with detailed category breakdowns. Be encouraging but honest. Output valid JSON." },
                    { role: "user", content: userContent },
                ], temperature: 0.5, max_tokens: 2000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error`);
        return JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
    },
});
