"use client";
import { ReactNode } from "react";
import Dashboard from "./components/Dashboard";
import { usePathname } from "next/navigation";
import { StyleProvider } from "@ant-design/cssinjs";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  let headerContent = "Welcome to dashboard";
  
  const currentPath = usePathname();

  if (currentPath === "/admin/dashboard/reported-posts") {
    headerContent = "Reported Posts";
  } else if (currentPath === "/admin/dashboard/new-account") {
    headerContent = "Create a New Account";
  }

  return (
    <Dashboard headerContent={headerContent}>
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </Dashboard>
  );
};

export default Layout;
