import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import NotificationProvider from "./notificationProvider";
import { ConfigProvider } from "antd";
import { theme } from "@/utils/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Payment",
  description: "Payment course mpesa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}><AntdRegistry>
        <ConfigProvider theme={theme}>
          <NotificationProvider>
          {children}
          </NotificationProvider>
        </ConfigProvider>
          </AntdRegistry></body>
    </html>
  );
}
