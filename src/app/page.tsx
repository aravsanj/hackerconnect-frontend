"use client";

import { TabsProps, Col, Row, Tabs, ConfigProvider, Card, Spin } from "antd";
import SignIn from "./components/SignIn";
import theme from "./theme/themeConfig";
import Register from "./components/Register";
import useUser from "./hooks/useUser";
import { useRouter } from "next/navigation";
import { StyleProvider } from "@ant-design/cssinjs";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Login`,
    children: <SignIn />,
  },
  {
    key: "2",
    label: `Register`,
    children: <Register />,
  },
];

export default function Page() {
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;
  const router = useRouter();

  if (isLoggedIn === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isLoggedIn) {
    router.push("/feed");
    return;
  }

  return (
    <ConfigProvider theme={theme}>
      <StyleProvider hashPriority="high">
        <Row className="h-[100vh] bg-[#1DA1F2]" justify="center">
          <Col>
            <Card className="relative top-48 left-[50%] -translate-x-[50%] max-w-[400px]">
              <Tabs centered={true} defaultActiveKey="1" items={items} />
            </Card>
          </Col>
        </Row>
      </StyleProvider>
    </ConfigProvider>
  );
}
