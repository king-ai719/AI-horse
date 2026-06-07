"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface Prediction {
  ai_name: string;
  main: string;
  color: string;
}

interface RacePrediction {
  id: string;
  race_name: string;
  predictions: Prediction[];
  created_at: string;
}

export default function MyPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [history, setHistory] = useState<RacePrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetchHistory();
  }, [isLoaded, isSignedIn]);

  const fetchHistory = async () => {
    const res = await fetch("/api/mypage");
    if (res.ok) {
      const data = await res.json();
      setHistory(data.history);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-xs mb-6 block transition-opacity hover:opacity-70" style={{ color: "rgba(232,234,240,0.4)" }}>
          ← トップに戻る
        </Link>
        <h2 className="font-display font-bold text-2xl" style={{ background: "linear-gradient(135deg, #FFFFFF, rgba(0,229,255,0.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          予想履歴
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-sm" style={{ color: "rgba(232,234,240,0.4)" }}>読み込み中...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-sm" style={{ color: "rgba(232,234,240,0.4)" }}>まだ予想履歴がありません</p>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item) => (
            <div key={item.id} className="rounded-xl p-4" style={{ background: "rgba(13,19,32,0.8)", border: "1px solid rgba(26,37,64,0.8)" }}>
              <div className="flex justify-between items-start mb-3">
                <p className="font-display font-bold text-base text-white">{item.race_name}</p>
                <p className="text-xs" style={{ color: "rgba(232,234,240,0.4)" }}>
                  {new Date(item.created_at).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {item.predictions.map((pred) => (
                  <div key={pred.ai_name} className="text-xs px-2 py-1 rounded-full" style={{ background: `${pred.color}20`, border: `1px solid ${pred.color}40`, color: pred.color }}>
                    {pred.ai_name}：{pred.main}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}