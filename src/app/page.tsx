"use client";

import { TabsProps, Col, Row, Tabs, ConfigProvider, Card, Spin } from "antd";
import SignIn from "./components/SignIn";
import theme from "./theme/themeConfig";
import Register from "./components/Register";
import useUser from "./hooks/useUser";
import { useRouter } from "next/navigation";
import { StyleProvider } from "@ant-design/cssinjs";
import ParticlesContainer from "./components/TsParticles";

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
            <ParticlesContainer />
            <Col>
              <div className="mt-24 text-center">
                <h1 className="text-4xl font-extrabold leading-tight text-black mb-2">
                  <span className="text-white font-mono italic">Konnect</span>
                </h1>
                <p className="text-lg">
                  <span className="text-white font-italic">
                    Let them{" "}
                    <span className="bg-white text-black rounded px-2">
                      know
                    </span>
                  </span>{" "}
                  <span className="text-white">
                    you&apos;re <i>here</i>
                  </span>
                </p>
              </div>
              <Card className="relative top-24 left-[50%] -translate-x-[50%] max-w-[400px]">
                <Tabs centered={true} defaultActiveKey="1" items={items} />
              </Card>
            </Col>
          </Row>
        </StyleProvider>
    </ConfigProvider>
  );
}
