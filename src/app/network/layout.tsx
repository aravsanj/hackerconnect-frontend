"use client";

import { Spin } from "antd";
import NavBar from "../components/NavBar";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";

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
    <div className="bg-[#8cd3ff]">
      <NavBar />
      {children}
    </div>
  );
}
