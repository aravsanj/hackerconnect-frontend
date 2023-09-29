"use client";

import { StyleProvider } from "@ant-design/cssinjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider hashPriority="high">
      <div className="bg-[#8cd3ff] min-h-screen pb-20">{children}</div>
    </StyleProvider>
  );
}
