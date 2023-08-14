import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { BASE_URL } from "../config";

type FieldType = {
  email: String;
};

type Props = {
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
};

export default function ForgotPassword({ setShowForgotPassword }: Props) {
  const [loading, setLoading] = useState(false);

  type NotificationType = "success" | "info" | "warning" | "error";

  const [api, contextHolder] = notification.useNotification();

  const openErrorNotification = (type: NotificationType) => {
    api[type]({
      message: "Wrong email!",
      description: "The user does not exist!",
    });
  };

  const openSuccessNotification = (type: NotificationType) => {
    api[type]({
      message: "Success!",
      description: "Please check your email for reset link!",
    });
  };

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/forgotPassword`,
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      openSuccessNotification("success");
    } catch (error) {
      openErrorNotification("error");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Form
        name="ForgotPass"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input size="middle" placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button
            className="w-full"
            size="middle"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Get reset link
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="link"
        className="!p-0"
        onClick={() => setShowForgotPassword(false)}
      >
        Go back
      </Button>
    </>
  );
}
