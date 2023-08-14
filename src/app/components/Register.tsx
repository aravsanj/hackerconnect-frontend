import { Button, Checkbox, DatePicker, Form, Input, notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../config";

type FieldType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
};

export default function Register() {
  const [loading, setLoading] = useState(false);

  type NotificationType = "success" | "info" | "warning" | "error";

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Account created successfully!",
      description: "You can now log in with your new account.",
    });
  };

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, values, {
        headers: { "Content-Type": "application/json" },
      });
      openNotificationWithIcon("success");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const usernameRegex = /^[a-zA-Z0-9]+$/;

  const verifyUsername = async (username: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/validateUsername`,
        { username },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const alreadyExits = response?.data?.alreadyExists;

      return alreadyExits;
    } catch (error) {
      console.log(error);
    }
  };

  const isValidUsername = (username: string) => {
    return usernameRegex.test(username);
  };

  const isValidPassword = (password: string): boolean => {
    return passwordRegex.test(password);
  };

  return (
    <>
      {contextHolder}
      <Form onFinish={onFinish}>
        <Form.Item
          name="firstName"
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          rules={[
            { required: true, message: "Please input your first name!" },
            {
              whitespace: true,
            },
            {
              min: 3,
            },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="First name" name="firstName" />
        </Form.Item>
        <span
          style={{
            display: "inline-block",
            width: "24px",
          }}
        ></span>
        <Form.Item
          name="lastName"
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          rules={[
            { required: true, message: "Please input your last name!" },
            {
              whitespace: true,
            },
            {
              min: 3,
            },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Last name" name="lastName" />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          rules={[
            { required: true, message: "Please input your date of birth!" },
            {
              type: "date",
            },
            {
              validator: (_, value) => {
                const birthDate = new Date(value);
                const currentDate = new Date();

                let ageDifference =
                  currentDate.getFullYear() - birthDate.getFullYear();

                if (
                  currentDate.getMonth() < birthDate.getMonth() ||
                  (currentDate.getMonth() === birthDate.getMonth() &&
                    currentDate.getDate() < birthDate.getDate())
                ) {
                  ageDifference--;
                }

                return ageDifference >= 18
                  ? Promise.resolve()
                  : Promise.reject("Must be 18 years old.");
              },
            },
          ]}
          hasFeedback={true}
        >
          <DatePicker placeholder="DOB" />
        </Form.Item>
        <span
          style={{
            display: "inline-block",
            width: "24px",
          }}
        ></span>
        <Form.Item
          name="phone"
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              type: "string",
            },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Phone" name="phone" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            { type: "email", message: "Please enter a valid email" },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Email" name="email" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please enter your username",
            },
            {
              min: 3,
            },
            {
              validator: async (_, value) => {
                const result = await verifyUsername(value);

                if(result) {
                  return Promise.reject("Username already exists.");
                }

                return value && isValidUsername(value)
                  ? Promise.resolve()
                  : Promise.reject(
                      "Username should only contain letters and numbers."
                    );
              },
            },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Username" name="username" />
        </Form.Item>

        <Form.Item
          name="password"
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
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
        <span
          style={{
            display: "inline-block",
            width: "24px",
          }}
        ></span>
        <Form.Item
          name="confirmPassword"
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
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

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      "To proceed, you need to agree with our terms and conditions"
                    ),
            },
          ]}
        >
          <Checkbox name="agree">I agree to the terms and conditions</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            loading={loading}
            className="w-full"
            type="primary"
            htmlType="submit"
          >
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
