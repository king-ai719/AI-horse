"use client";

import { useEffect, useState } from "react";

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
    <div className="ai-card p-5" style={{ borderColor: `${prediction.color}30` }}>
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${prediction.color}, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${prediction.color}15`, border: `1px solid ${prediction.color}40` }}>
            {prediction.icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm leading-tight" style={{ color: prediction.color }}>{prediction.ai_name}</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(232,234,240,0.4)" }}>重視：{prediction.focus}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-display font-bold" style={{ color: prediction.color }}>{getConfidenceLabel(prediction.confidence)}</span>
          <span className="font-display font-black text-lg leading-none" style={{ color: prediction.color }}>{prediction.confidence}<span className="text-xs font-normal ml-0.5">%</span></span>
        </div>
      </div>

      {/* 本命・対抗・単穴 */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: `${prediction.color}10`, border: `1px solid ${prediction.color}30` }}>
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>◎ 本命</p>
          <p className="font-display font-bold text-base" style={{ color: prediction.color }}>{prediction.main}</p>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: "rgba(26,37,64,0.6)", border: "1px solid rgba(26,37,64,0.8)" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>○ 対抗</p>
          <p className="font-display font-bold text-base" style={{ color: "rgba(232,234,240,0.8)" }}>{prediction.second}</p>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: "rgba(26,37,64,0.6)", border: "1px solid rgba(26,37,64,0.8)" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>△ 単穴</p>
          <p className="font-display font-bold text-base" style={{ color: "rgba(232,234,240,0.6)" }}>{prediction.third}</p>
        </div>
      </div>

      <div className="confidence-bar mb-3">
        <div className="confidence-fill" style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${prediction.color}80, ${prediction.color})`, boxShadow: `0 0 6px ${prediction.color}60` }} />
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(232,234,240,0.7)" }}>{prediction.reason}</p>

      {prediction.comment && (
        <div className="text-xs italic px-3 py-2 rounded-lg" style={{ color: prediction.color, background: `${prediction.color}08`, borderLeft: `2px solid ${prediction.color}60` }}>
          「{prediction.comment}」
        </div>
      )}
    </div>
  );
}"use client";

import { useEffect, useState } from "react";

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

interface AiCardProps {
  prediction: Prediction;
  index: number;
}

function DataHorseAvatar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      {/* 顔 */}
      <ellipse cx="20" cy="22" rx="11" ry="13" fill="#C8A876" />
      {/* 鼻づら */}
      <ellipse cx="20" cy="31" rx="6" ry="4" fill="#B8926A" />
      {/* 鼻の穴 */}
      <ellipse cx="18" cy="32" rx="1.2" ry="0.8" fill="#8B6347" />
      <ellipse cx="22" cy="32" rx="1.2" ry="0.8" fill="#8B6347" />
      {/* 耳 */}
      <ellipse cx="13" cy="11" rx="3" ry="5" fill="#C8A876" transform="rotate(-15 13 11)" />
      <ellipse cx="27" cy="11" rx="3" ry="5" fill="#C8A876" transform="rotate(15 27 11)" />
      <ellipse cx="13" cy="11" rx="1.5" ry="3" fill="#E8C4A0" transform="rotate(-15 13 11)" />
      <ellipse cx="27" cy="11" rx="1.5" ry="3" fill="#E8C4A0" transform="rotate(15 27 11)" />
      {/* 目 */}
      <ellipse cx="15.5" cy="20" rx="3.5" ry="3.5" fill="white" />
      <ellipse cx="24.5" cy="20" rx="3.5" ry="3.5" fill="white" />
      <ellipse cx="15.5" cy="20" rx="2" ry="2" fill="#3A2510" />
      <ellipse cx="24.5" cy="20" rx="2" ry="2" fill="#3A2510" />
      {/* 瓶底眼鏡フレーム */}
      <rect x="11" y="17" width="9" height="7" rx="3.5" fill="none" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="17" width="9" height="7" rx="3.5" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="20.5" x2="20" y2="20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* つる */}
      <line x1="11" y1="20.5" x2="8" y2="19" stroke={color} strokeWidth="1.2" />
      <line x1="29" y1="20.5" x2="32" y2="19" stroke={color} strokeWidth="1.2" />
      {/* たてがみ */}
      <ellipse cx="20" cy="10" rx="8" ry="5" fill="#8B6347" />
      <ellipse cx="15" cy="9" rx="3" ry="6" fill="#7A5235" transform="rotate(-10 15 9)" />
      <ellipse cx="20" cy="8" rx="3" ry="5" fill="#8B6347" />
      <ellipse cx="25" cy="9" rx="3" ry="6" fill="#7A5235" transform="rotate(10 25 9)" />
    </svg>
  );
}

function ChicHorseAvatar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      {/* 顔 */}
      <ellipse cx="20" cy="22" rx="11" ry="13" fill="#D4A574" />
      {/* 鼻づら */}
      <ellipse cx="20" cy="31" rx="6" ry="4" fill="#C4905E" />
      {/* 鼻の穴 */}
      <ellipse cx="18" cy="32" rx="1.2" ry="0.8" fill="#8B6347" />
      <ellipse cx="22" cy="32" rx="1.2" ry="0.8" fill="#8B6347" />
      {/* 耳 */}
      <ellipse cx="13" cy="11" rx="3" ry="5" fill="#D4A574" transform="rotate(-15 13 11)" />
      <ellipse cx="27" cy="11" rx="3" ry="5" fill="#D4A574" transform="rotate(15 27 11)" />
      <ellipse cx="13" cy="11" rx="1.5" ry="3" fill="#F0C8A0" transform="rotate(-15 13 11)" />
      <ellipse cx="27" cy="11" rx="1.5" ry="3" fill="#F0C8A0" transform="rotate(15 27 11)" />
      {/* ピアス */}
      <circle cx="10.5" cy="14" r="1.5" fill={color} />
      <circle cx="29.5" cy="14" r="1.5" fill={color} />
      {/* 目（細い流し目） */}
      <ellipse cx="15.5" cy="20" rx="3.5" ry="2.5" fill="white" />
      <ellipse cx="24.5" cy="20" rx="3.5" ry="2.5" fill="white" />
      <ellipse cx="16" cy="20.5" rx="2" ry="1.5" fill="#1A0A00" />
      <ellipse cx="25" cy="20.5" rx="2" ry="1.5" fill="#1A0A00" />
      {/* まつ毛（チャラい） */}
      <line x1="13" y1="17.5" x2="12" y2="16.5" stroke="#1A0A00" strokeWidth="1" />
      <line x1="15" y1="17" x2="14.5" y2="16" stroke="#1A0A00" strokeWidth="1" />
      <line x1="22" y1="17" x2="21.5" y2="16" stroke="#1A0A00" strokeWidth="1" />
      <line x1="24" y1="17.5" x2="23" y2="16.5" stroke="#1A0A00" strokeWidth="1" />
      {/* たてがみ（ワックスでキメた感じ） */}
      <ellipse cx="20" cy="9" rx="9" ry="5" fill="#4A3520" />
      <path d="M12 9 Q16 4 20 6 Q24 4 28 9" fill="#3A2510" />
      <path d="M15 8 Q18 3 20 5 Q22 3 25 8" fill="#5A4530" />
      {/* サングラス風アクセント */}
      <path d="M12 21 Q15.5 23 19 21" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M21 21 Q24.5 23 28 21" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

function GamblerHorseAvatar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      {/* 顔（少しくたびれた感じ） */}
      <ellipse cx="20" cy="23" rx="11" ry="13" fill="#B8946A" />
      {/* 鼻づら */}
      <ellipse cx="20" cy="32" rx="6" ry="4" fill="#A07850" />
      {/* 鼻の穴 */}
      <ellipse cx="18" cy="33" rx="1.2" ry="0.8" fill="#7A5235" />
      <ellipse cx="22" cy="33" rx="1.2" ry="0.8" fill="#7A5235" />
      {/* 耳（くたっとした） */}
      <ellipse cx="12" cy="13" rx="3" ry="5" fill="#B8946A" transform="rotate(-25 12 13)" />
      <ellipse cx="28" cy="13" rx="3" ry="5" fill="#B8946A" transform="rotate(25 28 13)" />
      <ellipse cx="12" cy="13" rx="1.5" ry="3" fill="#D4B08C" transform="rotate(-25 12 13)" />
      <ellipse cx="28" cy="13" rx="1.5" ry="3" fill="#D4B08C" transform="rotate(25 28 13)" />
      {/* 目（疲れた目） */}
      <ellipse cx="15.5" cy="21" rx="3.5" ry="2.8" fill="white" />
      <ellipse cx="24.5" cy="21" rx="3.5" ry="2.8" fill="white" />
      <ellipse cx="15.5" cy="21.5" rx="2" ry="1.8" fill="#2A1505" />
      <ellipse cx="24.5" cy="21.5" rx="2" ry="1.8" fill="#2A1505" />
      {/* 疲れたまぶた */}
      <path d="M12 19.5 Q15.5 18 19 19.5" stroke="#8B6347" strokeWidth="1.5" fill="none" />
      <path d="M21 19.5 Q24.5 18 28 19.5" stroke="#8B6347" strokeWidth="1.5" fill="none" />
      {/* 無精髭 */}
      <circle cx="16" cy="27" r="0.6" fill="#7A6050" opacity="0.7" />
      <circle cx="18.5" cy="28.5" r="0.6" fill="#7A6050" opacity="0.7" />
      <circle cx="21.5" cy="28.5" r="0.6" fill="#7A6050" opacity="0.7" />
      <circle cx="24" cy="27" r="0.6" fill="#7A6050" opacity="0.7" />
      <circle cx="17" cy="29" r="0.5" fill="#7A6050" opacity="0.6" />
      <circle cx="20" cy="29.5" r="0.5" fill="#7A6050" opacity="0.6" />
      <circle cx="23" cy="29" r="0.5" fill="#7A6050" opacity="0.6" />
      {/* たてがみ（ボサボサ） */}
      <ellipse cx="20" cy="11" rx="9" ry="6" fill="#6A5040" />
      <path d="M11 13 Q13 7 16 10 Q18 5 20 9 Q22 5 24 10 Q27 7 29 13" fill="#5A4030" />
      <path d="M13 12 Q14 8 16 11" stroke="#7A6050" strokeWidth="1" fill="none" />
      <path d="M27 12 Q26 8 24 11" stroke="#7A6050" strokeWidth="1" fill="none" />
      {/* 競馬新聞風アクセント */}
      <rect x="14" y="35" width="12" height="3" rx="1" fill={color} opacity="0.4" />
      <line x1="15" y1="36" x2="25" y2="36" stroke={color} strokeWidth="0.5" opacity="0.6" />
      <line x1="15" y1="37" x2="22" y2="37" stroke={color} strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

function HorseAvatar({ aiName, color }: { aiName: string; color: string }) {
  if (aiName === "データ分析AI") return <DataHorseAvatar color={color} />;
  if (aiName === "展開予想AI") return <ChicHorseAvatar color={color} />;
  return <GamblerHorseAvatar color={color} />;
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
    <div className="ai-card p-5" style={{ borderColor: `${prediction.color}30` }}>
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${prediction.color}, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: `${prediction.color}15`, border: `1px solid ${prediction.color}40` }}>
            <HorseAvatar aiName={prediction.ai_name} color={prediction.color} />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm leading-tight" style={{ color: prediction.color }}>{prediction.ai_name}</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(232,234,240,0.4)" }}>重視：{prediction.focus}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-display font-bold" style={{ color: prediction.color }}>{getConfidenceLabel(prediction.confidence)}</span>
          <span className="font-display font-black text-lg leading-none" style={{ color: prediction.color }}>{prediction.confidence}<span className="text-xs font-normal ml-0.5">%</span></span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: `${prediction.color}10`, border: `1px solid ${prediction.color}30` }}>
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>◎ 本命</p>
          <p className="font-display font-bold text-base" style={{ color: prediction.color }}>{prediction.main}</p>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: "rgba(26,37,64,0.6)", border: "1px solid rgba(26,37,64,0.8)" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>○ 対抗</p>
          <p className="font-display font-bold text-base" style={{ color: "rgba(232,234,240,0.8)" }}>{prediction.second}</p>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: "rgba(26,37,64,0.6)", border: "1px solid rgba(26,37,64,0.8)" }}>
          <p className="text-xs mb-1" style={{ color: "rgba(232,234,240,0.4)" }}>△ 単穴</p>
          <p className="font-display font-bold text-base" style={{ color: "rgba(232,234,240,0.6)" }}>{prediction.third}</p>
        </div>
      </div>

      <div className="confidence-bar mb-3">
        <div className="confidence-fill" style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${prediction.color}80, ${prediction.color})`, boxShadow: `0 0 6px ${prediction.color}60` }} />
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(232,234,240,0.7)" }}>{prediction.reason}</p>

      {prediction.comment && (
        <div className="text-xs italic px-3 py-2 rounded-lg" style={{ color: prediction.color, background: `${prediction.color}08`, borderLeft: `2px solid ${prediction.color}60` }}>
          「{prediction.comment}」
        </div>
      )}
    </div>
  );
}