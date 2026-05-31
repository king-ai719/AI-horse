import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

async function fetchRaceInfo(raceName: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    tools: [{ type: "web_search_20250305", name: "web_search" } as never],
    messages: [{
      role: "user",
      content: `「${raceName}」の出走馬リスト、騎手、枠番、オッズ（人気順）を検索して日本語でまとめてください。`,
    }],
  });

  return message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");
}

function buildPrompt(raceName: string, raceInfo: string, persona: typeof AI_PERSONAS[0], confidenceRange: string) {
  const differentiation = persona.ai_name === "穴馬AI"
    ? "- 必ず人気薄（5番人気以下）の馬を本命に選ぶこと\n- 上位人気馬を本命にすることは禁止\n"
    : persona.ai_name === "展開予想AI"
    ? "- データ分析AIとは異なる馬を本命に選ぶこと\n- 展開面で恵まれる馬を重視すること\n"
    : "- 実績・安定性重視で最も信頼できる馬を本命に選ぶこと\n";

  return persona.personality + "\n\n以下のレース情報をもとに予想してください。\nレース名: " + raceName + "\n\n【出走馬情報】\n" + raceInfo + "\n\n以下の点に必ず従ってください：\n- 必ず上記の出走馬リストの中から馬を選ぶこと\n- 「絶対」「確実」「間違いない」などの断定表現は使用禁止\n- 利益・的中を保証する表現は禁止\n- 理由は3行以内\n- 信頼度は" + confidenceRange + "の範囲で設定（必ずこの範囲内の整数）\n" + differentiation + "\n必ず以下のJSON形式のみで回答してください（他のテキスト不要）:\n{\n  \"ai_name\": \"" + persona.ai_name + "\",\n  \"icon\": \"" + persona.icon + "\",\n  \"color\": \"" + persona.color + "\",\n  \"focus\": \"" + persona.focus + "\",\n  \"main\": \"本命馬名\",\n  \"second\": \"対抗馬名\",\n  \"third\": \"単穴馬名\",\n  \"confidence\": 数値,\n  \"reason\": \"予想理由（3行以内）\",\n  \"comment\": \"一言コメント\"\n}";
}

async function getOnePrediction(raceName: string, raceInfo: string, persona: typeof AI_PERSONAS[0], confidenceRange: string) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    messages: [{ role: "user", content: buildPrompt(raceName, raceInfo, persona, confidenceRange) }],
  });
  const text = message.content.filter((b) => b.type === "text").map((b) => (b as { type: "text"; text: string }).text).join("");
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
  const text = message.content.filter((b) => b.type === "text").map((b) => (b as { type: "text"; text: string }).text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function POST(req: Request) {
  try {
    const { raceName } = await req.json();
    if (!raceName || typeof raceName !== "string" || raceName.trim().length === 0) {
      return NextResponse.json({ error: "レース名を入力してください" }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
    }

    // まず出走馬情報を取得
const raceInfo = await fetchRaceInfo(raceName.trim());
const trimmedRaceInfo = raceInfo.slice(0, 1500); // トークン節約

    // 3人同時に予想
    const [p1, p2, p3] = await Promise.all([
  getOnePrediction(raceName.trim(), trimmedRaceInfo, AI_PERSONAS[0], "65〜85"),
  getOnePrediction(raceName.trim(), trimmedRaceInfo, AI_PERSONAS[1], "55〜75"),
  getOnePrediction(raceName.trim(), trimmedRaceInfo, AI_PERSONAS[2], "50〜70"),
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
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}