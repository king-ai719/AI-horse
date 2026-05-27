"use client";

export default function LineCta() {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  const handleClick = () => {
    if (lineUrl === "#") {
      alert("LINE URLが設定されていません。.env.local を確認してください。");
      return;
    }
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #00B900 0%, #007A00 100%)",
        boxShadow: "0 0 30px rgba(0,185,0,0.2), 0 0 60px rgba(0,185,0,0.1)",
      }}
    >
      {/* 背景パターン */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            🔔
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white mb-1">
              次回のAI会議を受け取る
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              公式LINEに追加すると、次回レースの
              <br />
              AI会議速報をお届けします。
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="w-full py-3.5 rounded-xl font-display font-bold text-sm text-green-700 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-98"
          style={{ background: "#FFFFFF" }}
        >
          <svg
            viewBox="0 0 48 48"
            className="w-5 h-5 fill-current"
            style={{ color: "#00B900" }}
          >
            <path d="M24 4C12.95 4 4 11.73 4 21.2c0 5.2 2.6 9.83 6.68 13.05-0.3 1.13-1.93 6.87-2.02 7.42-0.12 0.72 0.26 0.72 0.54 0.52 0.22-0.15 8.62-5.7 9.62-6.37 1.66 0.24 3.37 0.38 5.18 0.38 11.05 0 20-7.73 20-17.2S35.05 4 24 4z" />
          </svg>
          公式LINEへ
        </button>
      </div>
    </div>
  );
}
