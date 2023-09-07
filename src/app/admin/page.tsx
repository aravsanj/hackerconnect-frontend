"use client";
import { Button, Input } from "antd";
import { Form } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../config";
import { useRouter } from "next/navigation";

type FieldType = {
  username: string;
  password: string;
};

type Props = {};

const Page = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      router.push("/admin/dashboard/reported-posts");
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#1DA1F2]">
      <h1 className="text-3xl font-semibold text-white mb-4 -mt-12">
        HC Admin Login
      </h1>

      <Form
        name="SignIn"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
        className="bg-white !px-6 !pt-6 rounded-lg"
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
    </div>
  );
};

export default Page;
