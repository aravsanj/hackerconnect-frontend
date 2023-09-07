import "./globals.css";
import StyledComponentsRegistry from "./lib/AntdRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserProvider from "./providers/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Konnect",
  description: "Let them know you're here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </UserProvider>
      </body>
    </html>
  );
}
