import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "AI馬券会議",
  description: "AI予想アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}