"use client";

import { Button, Form, Input, Typography, notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../../config";
import { usePathname, useRouter } from "next/navigation";

type FieldType = {
  password: string;
  confirmPassword: string;
};

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const isValidPassword = (password: string): boolean => {
  return passwordRegex.test(password);
};

export default function NewPasswordForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  type NotificationType = "success" | "info" | "warning" | "error";

  const [api, contextHolder] = notification.useNotification();

  const openErrorNotification = (type: NotificationType) => {
    api[type]({
      message: "Something went wrong",
      description: "The password was not updated!",
    });
  };

  const openSuccessNotification = (type: NotificationType) => {
    api[type]({
      message: "Success!",
      description: "You can now log in with your new password!",
    });
  };

  const pathname = usePathname();
  const _id = pathname.split("/")[2];

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/newPassword`,
        {
          ...values,
          _id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      openSuccessNotification("success");
      router.push("/");
    } catch (error) {
      openErrorNotification("error");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={4} className="text-center pb-6">
        Enter new password
      </Typography.Title>

      <Form
        name="NewPass"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="password"
          rules={[
            {
              validator: (_, value) =>
                value && isValidPassword(value)
                  ? Promise.resolve()
                  : Promise.reject(
                      "Password must contain at least one letter, one digit, and one special character, and be at least 8 characters long."
                    ),
            },
          ]}
          hasFeedback={true}
        >
          <Input.Password placeholder="password" name="password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords that you entered does not match."
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Confirm password"
            name="confirmPassword"
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="w-full"
            size="middle"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
