"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "🤖 AIたちが議論しています…",
  "📊 データ分析AIがオッズを解析中…",
  "🎯 展開予想AIが脚質を評価中…",
  "💥 穴馬AIが意外な馬を探索中…",
  "⚖️ 3人の意見を集計中…",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* グリッド背景 */}
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

      <div className="relative z-10 text-center">
        {/* ローディングリング */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full border-2 animate-spin"
            style={{
              borderColor: "transparent",
              borderTopColor: "var(--race-cyan)",
              animationDuration: "1.5s",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 animate-spin"
            style={{
              borderColor: "transparent",
              borderBottomColor: "var(--race-red)",
              animationDuration: "2s",
              animationDirection: "reverse",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            🤖
          </div>
        </div>

        {/* メッセージ */}
        <p
          className="font-display text-sm mb-2"
          style={{ color: "var(--race-cyan)" }}
          key={msgIndex}
        >
          {MESSAGES[msgIndex]}
        </p>

        {/* ドット */}
        <div className="flex gap-2 justify-center mt-4">
          <span className="loading-dot" style={{ background: "var(--race-cyan)" }} />
          <span className="loading-dot" style={{ background: "var(--race-red)" }} />
          <span className="loading-dot" style={{ background: "var(--race-gold)" }} />
        </div>
      </div>
    </div>
  );
}
