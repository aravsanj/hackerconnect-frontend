"use client";
import { Button, DatePicker, Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../../../config";
import { useRouter } from "next/navigation";

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

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/createNewAccount`,
        values,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      (() => form.resetFields())();
      message.info("Account created successfully");
    } catch (error) {
      console.error(error);
      router.push("/admin");
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
      console.error(error);
    }
  };

  const isValidUsername = (username: string) => {
    return usernameRegex.test(username);
  };

  const isValidPassword = (password: string): boolean => {
    return passwordRegex.test(password);
  };

  return (
    <div className="w-[500px]">
      <Form form={form} onFinish={onFinish}>
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

                if (result) {
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
          <Input.Password placeholder="Password" name="password" />
        </Form.Item>
        <span
          style={{
            display: "inline-block",
            width: "24px",
          }}
        ></span>

        <Form.Item>
          <Button
            loading={loading}
            className="w-full"
            type="primary"
            htmlType="submit"
          >
            Create Account
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
