"use client";

import { ConfigProvider } from "antd";
import NavBar from "../components/NavBar";
import ProfileProvider from "./providers/ProfileProvider.";
import { StyleProvider } from "@ant-design/cssinjs";
import theme from "../theme/themeConfig";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <StyleProvider hashPriority="high">
        <div className="bg-[#8cd3ff]">
          <NavBar />
          <ProfileProvider>{children}</ProfileProvider>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
}
