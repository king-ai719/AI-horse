"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [raceName, setRaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (isSignedIn) fetchPoints();
  }, [isSignedIn]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      window.history.replaceState({}, "", "/");
      setTimeout(() => fetchPoints(), 2000);
    }
  }, []);

  const fetchPoints = async () => {
    const res = await fetch("/api/points");
    if (res.ok) {
      const data = await res.json();
      setPoints(data.points);
    }
  };

  const handleSubmit = async () => {
    const trimmed = raceName.trim();
    if (!trimmed) { setError("レース名を入力してください"); return; }
    if (!points || points <= 0) { setError("ポイントが不足しています"); return; }
    setError("");
    setLoading(true);

    const ptRes = await fetch("/api/points", { method: "POST" });
    if (!ptRes.ok) { setError("ポイントが不足しています"); setLoading(false); return; }
    const ptData = await ptRes.json();
    setPoints(ptData.points);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raceName: trimmed }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "APIエラー"); }
      const data = await res.json();
      sessionStorage.setItem("aiHorseResult", JSON.stringify(data));
      router.push("/result");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setCheckingOut(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  if (!isLoaded) return null;

  const gridBg = "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: gridBg, backgroundSize: "40px 40px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,45,45,0.05) 0%, transparent 70%)" }} />

      <div className="absolute top-4 right-4 z-20">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in">
            <button className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "var(--race-cyan)" }}>
              ログイン
            </button>
          </Link>
        )}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-display tracking-widest opacity-70" style={{ color: "var(--race-cyan)" }}>AI SYSTEM v2.4</span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--race-red)" }} />
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl mb-3 leading-tight" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #E8EAF0 50%, rgba(0,229,255,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI馬券会議</h1>
          <div className="h-px w-32 mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, var(--race-red), transparent)" }} />
          <p className="text-sm leading-relaxed" style={{ color: "rgba(232,234,240,0.6)" }}>3人のAI予想屋が異なる視点で<br />レースをリアルタイム討論</p>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          {[
            { label: "データ分析AI", color: "var(--race-cyan)", icon: "📊" },
            { label: "展開予想AI", color: "var(--race-gold)", icon: "🎯" },
            { label: "穴馬AI", color: "var(--race-red)", icon: "💥" }
          ].map((ai) => (
            <div key={ai.label} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs" style={{ background: `${ai.color}15`, border: `1px solid ${ai.color}40`, color: ai.color }}>
              <span>{ai.icon}</span><span className="hidden sm:inline">{ai.label}</span>
            </div>
          ))}
        </div>

        {!isSignedIn ? (
          <div className="ai-card p-8 mb-4 text-center">
            <p className="text-sm mb-2" style={{ color: "rgba(232,234,240,0.7)" }}>利用するにはログインが必要です</p>
            <p className="text-xs mb-6" style={{ color: "rgba(232,234,240,0.4)" }}>登録で3ポイント無料プレゼント🎁</p>
            <Link href="/sign-up">
              <button className="btn-primary">ログイン / 新規登録</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-display tracking-widest" style={{ color: "rgba(232,234,240,0.4)" }}>POINTS</span>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg" style={{ color: points && points > 0 ? "var(--race-cyan)" : "var(--race-red)" }}>
                  {points === null ? "..." : points}
                </span>
                <span className="text-xs" style={{ color: "rgba(232,234,240,0.4)" }}>pt 残</span>
              </div>
            </div>

            <div className="ai-card p-6 mb-4">
              <label className="block text-xs font-display tracking-widest mb-3 uppercase" style={{ color: "var(--race-cyan)" }}>Race Info</label>
              <input className="race-input mb-4" type="text" placeholder="例: 東京11R、日本ダービー、有馬記念..." value={raceName} onChange={(e) => setRaceName(e.target.value)} onKeyDown={handleKeyDown} disabled={loading || points === 0} maxLength={50} />
              {error && <p className="text-xs mb-4 px-3 py-2 rounded" style={{ color: "var(--race-red)", background: "rgba(255,45,45,0.1)", border: "1px solid rgba(255,45,45,0.2)" }}>⚠ {error}</p>}

              {points === null || points > 0 ? (
                <button className="btn-primary" onClick={handleSubmit} disabled={loading || points === null}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="flex gap-1.5">
                        <span className="loading-dot" style={{ background: "rgba(255,255,255,0.7)" }} />
                        <span className="loading-dot" style={{ background: "rgba(255,255,255,0.7)" }} />
                        <span className="loading-dot" style={{ background: "rgba(255,255,255,0.7)" }} />
                      </span>
                      AI会議を招集中...
                    </span>
                  ) : `⚡ AI会議開始 (残${points}pt)`}
                </button>
              ) : (
                <div>
                  <div className="text-center mb-3 py-2 px-3 rounded-lg text-sm" style={{ color: "var(--race-gold)", background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)" }}>
                    ポイントが不足しています
                  </div>
                  <button className="btn-primary" onClick={handleCheckout} disabled={checkingOut} style={{ background: "linear-gradient(135deg, #FFB800, #CC8800)" }}>
                    {checkingOut ? "決済画面へ移動中..." : "💳 500円で6ポイント購入"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="text-center text-xs px-4 py-3 rounded-lg" style={{ color: "rgba(232,234,240,0.4)", background: "rgba(13,19,32,0.6)", border: "1px solid rgba(26,37,64,0.6)" }}>
          ⚠ これは予想支援・エンタメサービスです。<br />的中・利益を保証するものではありません。
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs font-display tracking-widest" style={{ color: "rgba(232,234,240,0.2)" }}>POWERED BY ANTHROPIC AI</p>
        </div>
      </div>
    </main>
  );
}