import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AI_PERSONAS = [
  {
    ai_name: "データ分析AI",
    icon: "📊",
    color: "#00E5FF",
    focus: "的中率重視・堅実予想",
    personality: `あなたは「データ分析AI」です。的中率を最優先にした堅実予想のスペシャリストです。1〜3番人気の上位人気馬を中心に、過去の連対率・コース適性・騎手勝率・前走着順から最も信頼できる馬を選びます。荒れる可能性は無視し、データが示す最有力馬を自信を持って推します。口調は冷静・断定的で「データ上、最も信頼できるのは〜」という表現を使います。`,
  },
  {
    ai_name: "展開予想AI",
    icon: "🎯",
    color: "#FFB800",
    focus: "中穴狙い・展開ハマり",
    personality: `あなたは「展開予想AI」です。レース展開から5〜10番人気の中穴馬が浮上するシナリオを探すスペシャリストです。ペース・脚質・位置取りの噛み合わせで人気以上の結果を出せる馬を選びます。上位人気馬は選ばず、展開次第で激走できる中穴馬を推します。口調は戦略的で「この展開なら〜が浮上する」という表現を使います。`,
  },
  {
    ai_name: "穴馬AI",
    icon: "💥",
    color: "#FF2D2D",
    focus: "大荒れ特化・超高配当狙い",
    personality: `あなたは「穴馬AI」です。10番人気以下の大穴馬から超高配当を狙うスペシャリストです。オッズの歪み・厩舎の秘密情報・調教気配・血統の爆発力から誰も注目していない馬を発掘します。必ず10番人気以下の馬を本命にしてください。口調は挑発的・興奮気味で「誰も気づいていないが〜」「ここが大穴の匂いがする」という表現を使います。`,
  },
];

async function fetchRaceInfo(raceName: string): Promise<string> {
  const searchResult = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 300,
    tools: [{ type: "web_search_20250305", name: "web_search" } as never],
    messages: [{
      role: "user",
      content: `netkeiba ${raceName} 出走馬 2026 の出走馬名と人気順を箇条書きで。`,
    }],
  });

  const text = searchResult.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  return text.slice(0, 300);
}

function buildPrompt(raceName: string, raceInfo: string, persona: typeof AI_PERSONAS[0], confidenceRange: string, exclude: string) {
  const differentiation = persona.ai_name === "穴馬AI"
    ? "- 必ず10番人気以下の馬を本命に選ぶこと\n- 上位人気馬を本命にすることは絶対禁止\n"
    : persona.ai_name === "展開予想AI"
    ? "- 必ず5〜10番人気の中穴馬を本命に選ぶこと\n- 1〜4番人気馬を本命にすることは禁止\n"
    : "- 必ず1〜3番人気の馬を本命に選ぶこと\n- 人気薄を本命にすることは禁止\n- 当日の天候・馬場状態も考慮すること\n";

  return persona.personality + "\n\nレース名: " + raceName + "\n\n【出走馬情報】\n" + raceInfo + "\n\n以下の点に必ず従ってください：\n- 必ず上記の出走馬リストの中から馬を選ぶこと\n- 「絶対」「確実」「間違いない」などの断定表現は使用禁止\n- 利益・的中を保証する表現は禁止\n- 理由は3行以内\n- 信頼度は" + confidenceRange + "の範囲で設定\n" + differentiation + exclude + "\n必ず以下のJSON形式のみで回答してください（他のテキスト不要）:\n{\n  \"ai_name\": \"" + persona.ai_name + "\",\n  \"icon\": \"" + persona.icon + "\",\n  \"color\": \"" + persona.color + "\",\n  \"focus\": \"" + persona.focus + "\",\n  \"main\": \"本命馬名\",\n  \"second\": \"対抗馬名\",\n  \"third\": \"単穴馬名\",\n  \"confidence\": 数値,\n  \"reason\": \"予想理由（3行以内）\",\n  \"comment\": \"一言コメント\"\n}";
}

async function getOnePrediction(raceName: string, raceInfo: string, persona: typeof AI_PERSONAS[0], confidenceRange: string, exclude: string) {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 500,
    messages: [{ role: "user", content: buildPrompt(raceName, raceInfo, persona, confidenceRange, exclude) }],
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

    // 3人同時に予想
    const raceInfo = await fetchRaceInfo(raceName.trim());
const trimmedRaceInfo = raceInfo.slice(0, 300);

const p1 = await getOnePrediction(raceName.trim(), trimmedRaceInfo, AI_PERSONAS[0], "75〜90", "");
await new Promise(r => setTimeout(r, 2000));
const p2 = await getOnePrediction(raceName.trim(), trimmedRaceInfo, AI_PERSONAS[1], "55〜70", `※「${p1.main}」は既に他のAIが本命にしているので選ばないこと。\n`);
await new Promise(r => setTimeout(r, 2000));
const p3 = await getOnePrediction(raceName.trim(), trimmedRaceInfo, AI_PERSONAS[2], "40〜60", `※「${p1.main}」「${p2.main}」は既に他のAIが本命にしているので選ばないこと。\n`);
    const predictions = [p1, p2, p3];
    const summary = await getSummary(raceName.trim(), predictions);

    return NextResponse.json({
      race_name: raceName.trim(),
      predictions,
      summary,
      generated_at: new Date().toISOString(),
      debug_raceInfo: trimmedRaceInfo,
    });
  } catch (err) {
    console.error("Predict API error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}