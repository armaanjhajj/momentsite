import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ImpulsePayload = {
  grad_year: string | null;
  major: string | null;
  vibes: string[];
  interests: string[];
  custom_interests: string[];
  intents: string[];
  pronouns: string | null;
  relationship_status: string | null;
  custom_note: string | null;
};

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const payload = (await req.json()) as ImpulsePayload;

  // 1. Upsert impulse row
  const { error: upsertError } = await supabase.from("impulse").upsert({
    user_id: user.id,
    grad_year: payload.grad_year,
    major: payload.major,
    vibes: payload.vibes,
    interests: payload.interests,
    custom_interests: payload.custom_interests,
    intents: payload.intents,
    pronouns: payload.pronouns,
    relationship_status: payload.relationship_status,
    custom_note: payload.custom_note,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // 2. Fetch the user's first name to build embedding text
  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.name?.split(" ")[0] || "This person";

  // 3. Build embedding blob (excludes pronouns + relationship status)
  const vibesStr = payload.vibes.join(", ");
  const interestsStr = [...payload.interests, ...payload.custom_interests].join(", ");
  const intentsStr = payload.intents.join(", ");
  const major = payload.major || "undeclared";
  const gradYear = payload.grad_year || "";

  const blob = [
    `${firstName} is a ${vibesStr} ${gradYear} ${major} student.`,
    interestsStr ? `Into ${interestsStr}.` : "",
    intentsStr ? `Looking for: ${intentsStr}.` : "",
    payload.custom_note || "",
  ]
    .filter(Boolean)
    .join(" ");

  // 4. Generate embedding + insights via OpenAI (if key exists)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    // Run embedding and insight generation in parallel
    const [embResult, insightResult] = await Promise.allSettled([
      fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: blob,
        }),
      }).then((r) => r.json()),
      generateInsights(openaiKey, firstName, payload),
    ]);

    // Update users.embedding
    if (embResult.status === "fulfilled") {
      const vector = embResult.value?.data?.[0]?.embedding;
      if (vector) {
        await supabase
          .from("users")
          .update({ embedding: vector })
          .eq("id", user.id);
      }
    }

    // Update impulse row with insights
    if (insightResult.status === "fulfilled" && insightResult.value) {
      const insights = insightResult.value;
      await supabase
        .from("impulse")
        .update({
          mbti_type: insights.mbti_type,
          synopsis: insights.synopsis,
          team_color: insights.team_color,
          stats: insights.stats,
          insights_generated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }
  }

  return NextResponse.json({ ok: true });
}

type Insights = {
  mbti_type: string;
  synopsis: string;
  team_color: "00F700" | "1A66FF" | "FFD700" | "FF2C77";
  stats: {
    energy: number;
    openness: number;
    discipline: number;
    creativity: number;
    social: number;
    adventure: number;
  };
};

async function generateInsights(
  apiKey: string,
  firstName: string,
  payload: ImpulsePayload
): Promise<Insights | null> {
  const systemPrompt = `You analyze a college student's personality profile and return a JSON object with:
- mbti_type: their likely Myers-Briggs type (e.g. "ENFP")
- synopsis: a 2-sentence punchy, specific description of who they are. Don't list their traits; interpret them. Write like a sharp friend describing them to someone, not a horoscope.
- team_color: one of "00F700" (disciplined grinder, 6am runs, intense), "1A66FF" (electric, spontaneous, outgoing, party), "FFD700" (mellow, performative, chill, coffee & cigarettes energy), or "FF2C77" (all-rounder, balanced, neutral).
- stats: an object with six integer fields from 0-100 that form a radar chart personality — energy, openness, discipline, creativity, social, adventure. Make them meaningfully vary; don't default to 50s.

Respond with ONLY valid JSON, no markdown, no prose.`;

  const userPrompt = `Name: ${firstName}
Grad year: ${payload.grad_year || "unknown"}
Major: ${payload.major || "unknown"}
Vibes (self-selected personality tags): ${payload.vibes.join(", ") || "none"}
Interests: ${[...payload.interests, ...payload.custom_interests].join(", ") || "none"}
Looking for: ${payload.intents.join(", ") || "none"}
Pronouns: ${payload.pronouns || "unspecified"}
Relationship: ${payload.relationship_status || "unspecified"}`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as Insights;
    return parsed;
  } catch {
    return null;
  }
}
