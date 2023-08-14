import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../config";
import ForgotPassword from "./ForgotPassword";
import useUser from "../hooks/useUser";

type FieldType = {
  username: String;
  password: String;
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const { refetch } = useUser();

  type NotificationType = "success" | "info" | "warning" | "error";

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Logged in failed!",
      description: "Password or username is wrong!",
    });
  };

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      refetch();
      router.push("/feed");
    } catch (error) {
      openNotificationWithIcon("error");
      console.error(error);
    }
    setLoading(false);
  };

  if (showForgotPassword) {
    return <ForgotPassword setShowForgotPassword={setShowForgotPassword} />;
  }

  return (
    <>
      {contextHolder}
      <Form
        name="SignIn"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input size="middle" placeholder="Username" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="middle" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            className="w-full"
            size="middle"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="link"
        className="!p-0"
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot password?
      </Button>
    </>
  );
}
