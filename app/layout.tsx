import type { Metadata } from "next";
import { Anton, Bungee, Inconsolata } from "next/font/google";
import "./globals.css";

const bungee = Bungee({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const anton = Anton({
  variable: "--font-field",
  subsets: ["latin"],
  weight: "400",
});

const inconsolata = Inconsolata({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Jago Bangun Persada | Masuk",
  description: "Masuk ke akun Jago Bangun Persada.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${bungee.variable} ${anton.variable} ${inconsolata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
