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
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-LODN4SPQFC"></script>
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LODN4SPQFC');
          `}} />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}