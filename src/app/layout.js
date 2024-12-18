import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "在线教育平台",
  description: "大家都爱学的在线教育平台",
  icons: {
    icon: '/favicon.png', // 路径相对于 public 目录
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Head> */}
        {/* 引入外部脚本 */}
        <script
          type="text/javascript"
          charSet="utf-8"
          src="https://static.alicaptcha.com/v4/ct4.js"
          async
        />
      {/* </Head> */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
