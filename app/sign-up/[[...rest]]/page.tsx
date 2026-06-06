"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,45,45,0.05) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 text-center mb-8">
        <h1
          className="font-display font-black text-3xl mb-2"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, rgba(0,229,255,0.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI馬券会議
        </h1>
        <p className="text-xs" style={{ color: "rgba(232,234,240,0.4)" }}>
          登録で3ポイント無料プレゼント🎁
        </p>
      </div>
      <div className="relative z-10">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#00E5FF",
              colorBackground: "#0D1320",
              colorText: "#E8EAF0",
              colorTextSecondary: "rgba(232,234,240,0.6)",
              colorInputBackground: "#111827",
              colorInputText: "#E8EAF0",
              borderRadius: "8px",
            },
            elements: {
              card: "shadow-none border border-[rgba(26,37,64,0.8)] bg-[#0D1320]",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.05)] text-[#E8EAF0] hover:bg-[rgba(0,229,255,0.1)]",
              formButtonPrimary:
                "bg-gradient-to-r from-[#00E5FF] to-[#0099BB] text-[#080B12] font-bold hover:opacity-90",
              footerActionLink: "text-[#00E5FF]",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
        />
      </div>
    </main>
  );
}