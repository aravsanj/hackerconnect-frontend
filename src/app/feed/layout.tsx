"use client";

import { ConfigProvider, Spin } from "antd";
import NavBar from "../components/NavBar";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";
import { StyleProvider } from "@ant-design/cssinjs";
import theme from "../theme/themeConfig";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;

  if (isLoggedIn === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isLoggedIn) {
    router.push("/");
    return;
  }

  return (
    <ConfigProvider theme={theme}>
      <StyleProvider hashPriority="high">
        <div className="bg-[#8cd3ff] min-h-screen pb-20">
          <NavBar />
          {children}
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
}
