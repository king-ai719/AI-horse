import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import Script from "next/script";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "AI馬券会議",
  description: "AI予想アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <head>
          <meta name="google-site-verification" content="F3XHfXpe09RHh5-ajvHkXX6iFyx9gjcse1IuCIeIgR4" />
        </head>
        <body>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-LODN4SPQFC"
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LODN4SPQFC');
            `}
          </Script>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}