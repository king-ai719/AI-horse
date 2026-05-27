import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "AI馬券会議 | 3人のAI予想屋が競馬を討論",
  description:
    "3人のAI予想屋が異なる視点でレースを分析。データ派・展開派・穴馬派がリアルタイムで討論。予想支援・エンタメサービスです。",
};

export const viewport: Viewport = {
  themeColor: "#080B12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body>{children}</body>
    </html>
  );
}
