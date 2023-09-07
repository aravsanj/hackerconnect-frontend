"use client";

import { ConfigProvider, Spin } from "antd";
import NavBar from "../components/NavBar";
import ProfileProvider from "./providers/ProfileProvider.";
import { StyleProvider } from "@ant-design/cssinjs";
import theme from "../theme/themeConfig";
import useProfile from "./hooks/useProfile";
import useUser from "../hooks/useUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;

  if (isLoggedIn === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <ConfigProvider theme={theme}>
      <StyleProvider hashPriority="high">
        <div className="bg-[#8cd3ff] min-h-screen">
          <NavBar />
          <ProfileProvider>{children}</ProfileProvider>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
}
