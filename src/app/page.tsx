"use client";

import { TabsProps, Col, Row, Tabs, ConfigProvider, Card } from "antd";
import SignIn from "./components/SignIn";
import theme from "./theme/themeConfig";
import Register from "./components/Register";

const onChange = (key: string) => {
  // console.log(key);
};

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
  return (
    <ConfigProvider theme={theme}>
      <Row className="h-[100vh] bg-[#1DA1F2]" justify="center">
        <Col>
          <Card className="relative top-48 left-[50%] -translate-x-[50%] max-w-[400px]">
            <Tabs
              centered={true}
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
            />
          </Card>
        </Col>
      </Row>
    </ConfigProvider>
  );
}
