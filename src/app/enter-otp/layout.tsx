"use client";

import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import theme from "../theme/themeConfig";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </ConfigProvider>
  );
}
