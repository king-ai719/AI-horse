import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AI馬券会議 | 3人のAI予想屋が競馬を討論",
  description: "3人のAI予想屋が異なる視点でレースを討論。データ派・展開派・穴馬派がリアルタイムで予想。",
};

export const viewport: Viewport = {
  themeColor: "#080B12",
};

const jaLocalization = {
  locale: "ja-JP",
  signIn: {
    start: {
      title: "ログイン",
      subtitle: "AI馬券会議へようこそ",
      actionText: "アカウントをお持ちでない方は",
      actionLink: "新規登録",
    },
    emailCode: {
      title: "確認コードを入力",
      subtitle: "メールアドレスに送信されたコードを入力してください",
      formTitle: "確認コード",
      formSubtitle: "メールに届いたコードを入力",
      resendButton: "コードを再送信",
    },
    password: {
      title: "パスワードを入力",
      actionLink: "別の方法でログイン",
    },
  },
  signUp: {
    start: {
      title: "新規登録",
      subtitle: "アカウントを作成して3ptゲット",
      actionText: "すでにアカウントをお持ちの方は",
      actionLink: "ログイン",
    },
    emailCode: {
      title: "メールアドレスを確認",
      subtitle: "確認コードをメールに送信しました",
      formTitle: "確認コード",
      formSubtitle: "メールに届いたコードを入力してください",
      resendButton: "コードを再送信",
    },
    continue: {
      title: "情報を入力",
      subtitle: "残りの情報を入力してください",
      actionText: "すでにアカウントをお持ちの方は",
      actionLink: "ログイン",
    },
  },
  userButton: {
    action__manageAccount: "アカウント管理",
    action__signOut: "ログアウト",
    action__signOutAll: "全デバイスからログアウト",
    action__addAccount: "アカウントを追加",
  },
  formFieldLabel__emailAddress: "メールアドレス",
  formFieldLabel__password: "パスワード",
  formFieldLabel__firstName: "名",
  formFieldLabel__lastName: "姓",
  formFieldInputPlaceholder__emailAddress: "メールアドレスを入力",
  formFieldInputPlaceholder__password: "パスワードを入力",
  formButtonPrimary: "続ける",
  socialButtonsBlockButton: "{{provider}}で続ける",
  dividerText: "または",
  footerActionLink__useAnotherMethod: "別の方法でログイン",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={jaLocalization}>
      <html lang="ja" className="dark">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}