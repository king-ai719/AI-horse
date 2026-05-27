"use client";

interface Summary {
  majority_pick: string;
  key_point: string;
  conclusion: string;
  final_comment: string;
  agreement_level: string;
}

interface Prediction {
  ai_name: string;
  icon: string;
  color: string;
  main: string;
}

interface SummaryCardProps {
  summary: Summary;
  predictions: Prediction[];
}

export default function SummaryCard({ summary, predictions }: SummaryCardProps) {
  return (
    <div
      className="ai-card p-5"
      style={{
        borderColor: "rgba(255,184,0,0.3)",
        background:
          "linear-gradient(135deg, rgba(13,19,32,0.95) 0%, rgba(20,15,5,0.95) 100%)",
      }}
    >
      {/* トップライン */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{
          background: "linear-gradient(90deg, transparent, #FFB800, transparent)",
        }}
      />

      {/* タイトル */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{
            background: "rgba(255,184,0,0.15)",
            border: "1px solid rgba(255,184,0,0.4)",
          }}
        >
          ⚖️
        </div>
        <div>
          <h3
            className="font-display font-bold text-sm"
            style={{ color: "#FFB800" }}
          >
            AI会議まとめ
          </h3>
          <p className="text-xs" style={{ color: "rgba(232,234,240,0.4)" }}>
            {summary.agreement_level}
          </p>
        </div>
      </div>

      {/* 多数決 */}
      <div
        className="rounded-xl p-4 mb-4 relative overflow-hidden"
        style={{
          background: "rgba(255,184,0,0.08)",
          border: "1px solid rgba(255,184,0,0.3)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,184,0,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <p
            className="text-xs font-display tracking-widest mb-2"
            style={{ color: "rgba(255,184,0,0.6)" }}
          >
            MAJORITY VOTE
          </p>
          <p
            className="font-display font-black text-3xl mb-1"
            style={{
              color: "#FFB800",
              textShadow: "0 0 20px rgba(255,184,0,0.4)",
            }}
          >
            {summary.majority_pick}
          </p>
          {/* 各AIの本命を小さく表示 */}
          <div className="flex gap-3 mt-2">
            {predictions.map((p) => (
              <div key={p.ai_name} className="flex items-center gap-1">
                <span className="text-xs">{p.icon}</span>
                <span
                  className="text-xs font-display"
                  style={{ color: p.color }}
                >
                  {p.main}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 注目ポイント */}
      <div className="mb-4">
        <p
          className="text-xs font-display tracking-widest mb-2"
          style={{ color: "rgba(255,184,0,0.5)" }}
        >
          KEY POINT
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(232,234,240,0.8)" }}>
          {summary.key_point}
        </p>
      </div>

      {/* 総合結論 */}
      <div
        className="rounded-lg p-4 mb-4"
        style={{
          background: "rgba(26,37,64,0.6)",
          border: "1px solid rgba(26,37,64,0.8)",
        }}
      >
        <p
          className="text-xs font-display tracking-widest mb-2"
          style={{ color: "rgba(0,229,255,0.6)" }}
        >
          CONCLUSION
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(232,234,240,0.8)" }}>
          {summary.conclusion}
        </p>
      </div>

      {/* 締めコメント */}
      <div
        className="text-sm italic text-center px-3 py-3 rounded-lg"
        style={{
          color: "#FFB800",
          background: "rgba(255,184,0,0.06)",
          borderLeft: "2px solid rgba(255,184,0,0.4)",
        }}
      >
        「{summary.final_comment}」
      </div>
    </div>
  );
}
