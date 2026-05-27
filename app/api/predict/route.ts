import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const AI_PERSONAS = [
  {
    ai_name: "データ分析AI",
    icon: "📊",
    color: "#00E5FF",
    focus: "過去傾向・安定性・条件一致",
    personality: `あなたは「データ分析AI」です。競馬の予想において、過去の出走データ・馬場状態・距離適性・騎手成績などの統計的観点を最重視します。感情を排除し、数字と傾向から冷静に分析します。口調は論理的・分析的で、「データ上は〜」「傾向として〜」という表現を使います。`,
  },
  {
    ai_name: "展開予想AI",
    icon: "🎯",
    color: "#FFB800",
    focus: "脚質・流れ・レース展開",
    personality: `あなたは「展開予想AI」です。競馬の予想において、各馬の脚質・ペース・展開・位置取りを最重視します。口調は戦略的・シナリオ思考で、「展開的には〜」「流れが〜」という表現を使います。`,
  },
  {
    ai_name: "穴馬AI",
    icon: "💥",
    color: "#FF2D2D",
    focus: "期待値・人気ギャップ・意外性",
    personality: `あなたは「穴馬AI」です。競馬の予想において、人気と実力のギャップ・オッズの歪み・隠れた実力馬を最重視します。口調は挑発的・エモーショナルで、「面白いのは〜」「ここに妙味がある」という表現を使います。`,
  },
];

function buildPrompt(raceName: string, persona: typeof AI_PERSONAS[0]) {
  return persona.personality + "\n\n以下のレースについて予想を行ってください。\nレース名: " + raceName + "\n\n以下の点に必ず従ってください：\n- 「絶対」「確実」「間違いない」などの断定表現は使用禁止\n- 利益・的中を保証する表現は禁止\n- 理由は3行以内\n- 信頼度は50〜85の範囲で設定\n\n必ず以下のJSON形式のみで回答してください（他のテキスト不要）:\n{\n  \"ai_name\": \"" + persona.ai_name + "\",\n  \"icon\": \"" + persona.icon + "\",\n  \"color\": \"" + persona.color + "\",\n  \"focus\": \"" + persona.focus + "\",\n  \"main\": \"本命馬名\",\n  \"second\": \"対抗馬名\",\n  \"confidence\": 数値,\n  \"reason\": \"予想理由（3行以内）\",\n  \"comment\": \"一言コメント\"\n}";
}

async function getOnePrediction(raceName: string, persona: typeof AI_PERSONAS[0]) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    messages: [{ role: "user", content: buildPrompt(raceName, persona) }],
  });
  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function getSummary(raceName: string, predictions: unknown[]) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 600,
    messages: [{
      role: "user",
      content: "以下は「" + raceName + "」についての3人のAI予想屋の意見です。\n\n" + JSON.stringify(predictions, null, 2) + "\n\nあなたは会議の司会者AIです。3人の意見をまとめてください。断定・保証表現禁止。\n\n必ず以下のJSON形式のみで回答:\n{\n  \"majority_pick\": \"多数決の本命馬名\",\n  \"key_point\": \"注目ポイント（1〜2行）\",\n  \"conclusion\": \"総合結論（2〜3行）\",\n  \"final_comment\": \"締めコメント\",\n  \"agreement_level\": \"意見一致度の説明\"\n}"
    }],
  });
  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function POST(req: Request) {
  try {
    const { raceName } = await req.json();
    if (!raceName || typeof raceName !== "string" || raceName.trim().length === 0) {
      return NextResponse.json({ error: "レース名が入力されていません" }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
    }
    const [p1, p2, p3] = await Promise.all([
      getOnePrediction(raceName.trim(), AI_PERSONAS[0]),
      getOnePrediction(raceName.trim(), AI_PERSONAS[1]),
      getOnePrediction(raceName.trim(), AI_PERSONAS[2]),
    ]);
    const predictions = [p1, p2, p3];
    const summary = await getSummary(raceName.trim(), predictions);
    return NextResponse.json({
      race_name: raceName.trim(),
      predictions,
      summary,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Predict API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
