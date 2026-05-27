"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [raceName, setRaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = raceName.trim();
    if (!trimmed) {
      setError("レース名を入力してください");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raceName: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "API エラーが発生しました");
      }

      const data = await res.json();
      // セッションストレージに保存して結果画面へ
      sessionStorage.setItem("aiHorseResult", JSON.stringify(data));
      router.push("/result");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 背景グリッド */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 背景グロウ */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,45,45,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* ロゴ */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className="text-xs font-display tracking-widest text-race-cyan opacity-70"
              style={{ color: "var(--race-cyan)" }}
            >
              AI SYSTEM v2.4
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--race-red)" }}
            />
          </div>

          <h1
            className="font-display font-black text-4xl sm:text-5xl mb-3 leading-tight"
            style={{
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #E8EAF0 50%, rgba(0,229,255,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI馬券会議
          </h1>

          <div
            className="h-px w-32 mx-auto mb-4"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--race-red), transparent)",
            }}
          />

          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(232,234,240,0.6)" }}
          >
            3人のAI予想屋が異なる視点で
            <br />
            レースをリアルタイム討論
          </p>
        </div>

        {/* AI紹介バッジ */}
        <div className="flex gap-2 justify-center mb-8">
          {[
            { label: "データ分析AI", color: "var(--race-cyan)", icon: "📊" },
            { label: "展開予想AI", color: "var(--race-gold)", icon: "🎯" },
            { label: "穴馬AI", color: "var(--race-red)", icon: "💥" },
          ].map((ai) => (
            <div
              key={ai.label}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs"
              style={{
                background: `${ai.color}15`,
                border: `1px solid ${ai.color}40`,
                color: ai.color,
              }}
            >
              <span>{ai.icon}</span>
              <span className="hidden sm:inline">{ai.label}</span>
            </div>
          ))}
        </div>

        {/* 入力カード */}
        <div className="ai-card p-6 mb-4">
          <label
            className="block text-xs font-display tracking-widest mb-3 uppercase"
            style={{ color: "var(--race-cyan)" }}
          >
            Race Info
          </label>

          <input
            className="race-input mb-4"
            type="text"
            placeholder="例: 東京11R、日本ダービー、有馬記念..."
            value={raceName}
            onChange={(e) => setRaceName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={50}
          />

          {error && (
            <p
              className="text-xs mb-4 px-3 py-2 rounded"
              style={{
                color: "var(--race-red)",
                background: "rgba(255,45,45,0.1)",
                border: "1px solid rgba(255,45,45,0.2)",
              }}
            >
              ⚠ {error}
            </p>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="flex gap-1.5">
                  <span
                    className="loading-dot"
                    style={{ background: "rgba(255,255,255,0.7)" }}
                  />
                  <span
                    className="loading-dot"
                    style={{ background: "rgba(255,255,255,0.7)" }}
                  />
                  <span
                    className="loading-dot"
                    style={{ background: "rgba(255,255,255,0.7)" }}
                  />
                </span>
                AI会議を招集中...
              </span>
            ) : (
              "⚡ AI会議開始"
            )}
          </button>
        </div>

        {/* 注意書き */}
        <div
          className="text-center text-xs px-4 py-3 rounded-lg"
          style={{
            color: "rgba(232,234,240,0.4)",
            background: "rgba(13,19,32,0.6)",
            border: "1px solid rgba(26,37,64,0.6)",
          }}
        >
          ⚠ これは予想支援・エンタメサービスです。
          <br />
          的中・利益を保証するものではありません。
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p
            className="text-xs font-display tracking-widest"
            style={{ color: "rgba(232,234,240,0.2)" }}
          >
            POWERED BY ANTHROPIC AI
          </p>
        </div>
      </div>
    </main>
  );
}
