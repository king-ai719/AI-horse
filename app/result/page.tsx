"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AiCard from "@/components/AiCard";
import SummaryCard from "@/components/SummaryCard";
import LineCta from "@/components/LineCta";
import LoadingScreen from "@/components/LoadingScreen";

interface Prediction {
  ai_name: string;
  icon: string;
  color: string;
  focus: string;
  main: string;
  second: string;
  third: string;
  confidence: number;
  reason: string;
  comment: string;
}

interface Summary {
  majority_pick: string;
  key_point: string;
  conclusion: string;
  final_comment: string;
  agreement_level: string;
}

interface ResultData {
  race_name: string;
  predictions: Prediction[];
  summary: Summary;
  generated_at: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("aiHorseResult");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      const parsed: ResultData = JSON.parse(stored);
      setData(parsed);

      // カード順に出現アニメーション
      parsed.predictions.forEach((_, i) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, i]);
        }, i * 400);
      });

      // まとめカード
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, 99]);
      }, parsed.predictions.length * 400 + 300);
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!data) return <LoadingScreen />;

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs mb-6 transition-opacity hover:opacity-70"
          style={{ color: "rgba(232,234,240,0.4)" }}
        >
          ← 新しいレースを分析
        </button>

        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-3 font-display tracking-wider"
          style={{
            background: "rgba(255,45,45,0.1)",
            border: "1px solid rgba(255,45,45,0.3)",
            color: "var(--race-red)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--race-red)" }}
          />
          AI CONFERENCE RESULT
        </div>

        <h2
          className="font-display font-bold text-2xl"
          style={{
            background: "linear-gradient(135deg, #FFFFFF, rgba(0,229,255,0.8))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {data.race_name}
        </h2>

        <p className="text-xs mt-1" style={{ color: "rgba(232,234,240,0.4)" }}>
          {new Date(data.generated_at).toLocaleString("ja-JP")} 分析
        </p>
      </div>

      {/* セクションタイトル */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-display tracking-widest"
          style={{ color: "var(--race-cyan)" }}
        >
          AI PREDICTIONS
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,229,255,0.4), transparent)",
          }}
        />
      </div>

      {/* AIカード一覧 */}
      <div className="flex flex-col gap-4 mb-8">
        {data.predictions.map((pred, i) => (
          <div
            key={pred.ai_name}
            className="card-appear"
            style={{
              animationDelay: `${i * 0.1}s`,
              opacity: visibleCards.includes(i) ? 1 : 0,
              transform: visibleCards.includes(i)
                ? "translateY(0)"
                : "translateY(24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <AiCard prediction={pred} index={i} />
          </div>
        ))}
      </div>

      {/* まとめ */}
      <div
        style={{
          opacity: visibleCards.includes(99) ? 1 : 0,
          transform: visibleCards.includes(99)
            ? "translateY(0)"
            : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-xs font-display tracking-widest"
            style={{ color: "var(--race-gold)" }}
          >
            CONFERENCE SUMMARY
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,184,0,0.4), transparent)",
            }}
          />
        </div>

        <SummaryCard summary={data.summary} predictions={data.predictions} />
      </div>

{/* 履歴リンク */}
<div className="mt-6 text-center">
  <Link href="/mypage" className="text-xs" style={{ color: "var(--race-cyan)" }}>
    📋 予想履歴を見る
  </Link>
</div>

      {/* LINE導線 */}
      <div className="mt-8">
        <LineCta />
      </div>

      {/* 注意書き */}
      <div
        className="mt-6 text-center text-xs px-4 py-3 rounded-lg"
        style={{
          color: "rgba(232,234,240,0.3)",
          background: "rgba(13,19,32,0.6)",
          border: "1px solid rgba(26,37,64,0.4)",
        }}
      >
        ⚠ このサービスは予想支援・エンタメ目的です。
        <br />
        的中・利益を保証するものではありません。
        <br />
        最終判断はご自身でお願いします。
      </div>

      <div className="h-12" />
    </main>
  );
}
