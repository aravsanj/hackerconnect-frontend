"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { UserAddOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Spin, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/app/config";

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Reported posts",
    "/admin/dashboard/reported-posts",
    <ExclamationCircleOutlined />
  ),
  getItem(
    "Create new account",
    "/admin/dashboard/new-account",
    <UserAddOutlined />
  ),
];

const Dashboard = ({
  children,
  headerContent,
}: {
  children: ReactNode;
  headerContent: ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const router = useRouter();

  const ping = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/ping`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setIsAdminLoggedIn(true);
    } catch (e: any) {
      router.push("/admin");
    }
  };

  useEffect(() => {
    ping();
  }, []);

  if (!isAdminLoggedIn) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["/admin/dashboard/reported-posts"]}
          mode="inline"
          items={items}
          onSelect={(e) => router.push(e.key)}
        />
      </Sider>
      <Layout>
        <Header className="!bg-white">{headerContent}</Header>
        <Content style={{ margin: "0 16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
