"use client";

import { useEffect, useState } from "react";

interface Prediction {
  ai_name: string;
  icon: string;
  color: string;
  focus: string;
  main: string;
  second: string;
  confidence: number;
  reason: string;
  comment: string;
}

interface AiCardProps {
  prediction: Prediction;
  index: number;
}

export default function AiCard({ prediction, index }: AiCardProps) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(prediction.confidence);
    }, index * 400 + 300);
    return () => clearTimeout(timer);
  }, [prediction.confidence, index]);

  const getConfidenceLabel = (c: number) => {
    if (c >= 80) return "HIGH";
    if (c >= 65) return "MED";
    return "LOW";
  };

  return (
    <div
      className="ai-card p-5"
      style={{ borderColor: `${prediction.color}30` }}
    >
      {/* カードトップライン */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${prediction.color}, transparent)`,
        }}
      />

      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: `${prediction.color}15`,
              border: `1px solid ${prediction.color}40`,
            }}
          >
            {prediction.icon}
          </div>
          <div>
            <h3
              className="font-display font-bold text-sm leading-tight"
              style={{ color: prediction.color }}
            >
              {prediction.ai_name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(232,234,240,0.4)" }}>
              重視：{prediction.focus}
            </p>
          </div>
        </div>

        {/* 信頼度バッジ */}
        <div
          className="flex flex-col items-end gap-1"
        >
          <span
            className="text-xs font-display font-bold"
            style={{ color: prediction.color }}
          >
            {getConfidenceLabel(prediction.confidence)}
          </span>
          <span
            className="font-display font-black text-lg leading-none"
            style={{ color: prediction.color }}
          >
            {prediction.confidence}
            <span className="text-xs font-normal ml-0.5">%</span>
          </span>
        </div>
      </div>

      {/* 本命・対抗 */}
      <div className="flex gap-3 mb-4">
        <div
          className="flex-1 rounded-lg px-3 py-2.5"
          style={{
            background: `${prediction.color}10`,
            border: `1px solid ${prediction.color}30`,
          }}
        >
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>
            ◎ 本命
          </p>
          <p
            className="font-display font-bold text-base"
            style={{ color: prediction.color }}
          >
            {prediction.main}
          </p>
        </div>
        <div
          className="flex-1 rounded-lg px-3 py-2.5"
          style={{
            background: "rgba(26,37,64,0.6)",
            border: "1px solid rgba(26,37,64,0.8)",
          }}
        >
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>
            ○ 対抗
          </p>
          <p
            className="font-display font-bold text-base"
            style={{ color: "rgba(232,234,240,0.8)" }}
          >
            {prediction.second}
          </p>
        </div>
      </div>

      {/* 信頼度バー */}
      <div className="confidence-bar mb-3">
        <div
          className="confidence-fill"
          style={{
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${prediction.color}80, ${prediction.color})`,
            boxShadow: `0 0 6px ${prediction.color}60`,
          }}
        />
      </div>

      {/* 理由 */}
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "rgba(232,234,240,0.7)" }}
      >
        {prediction.reason}
      </p>

      {/* 一言コメント */}
      {prediction.comment && (
        <div
          className="text-xs italic px-3 py-2 rounded-lg"
          style={{
            color: prediction.color,
            background: `${prediction.color}08`,
            borderLeft: `2px solid ${prediction.color}60`,
          }}
        >
          「{prediction.comment}」
        </div>
      )}
    </div>
  );
}
