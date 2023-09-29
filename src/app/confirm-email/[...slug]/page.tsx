"use client";
import { BASE_URL } from "@/app/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Alert, Button, Spin } from "antd";

type Props = {};

const Page = (props: Props) => {
  const [verified, setVerified] = useState(false);
  const [expired, setExpired] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const userId = pathname.split("/")[2];
  const token = pathname.split("/")[3];

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/verifyEmail`,
        {
          userId,
          token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setVerified(true);
    } catch (e: any) {
      setExpired(true);
      console.error(e);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  if (expired) {
    return (
      <div className="h-screen flex flex-col gap-y-2 justify-center items-center">
        <Alert
          message="Looks like the link has expired. Try logging in again and resend the
          confirmation mail."
          type="error"
          showIcon
        />
        <Button type="primary" onClick={() => router.push("/")}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col gap-y-2 justify-center items-center">
      {!verified ? (
        <div>
          <Spin tip="Loading" size="small"></Spin>
          <span className="ml-2">Verifying your email...</span>
        </div>
      ) : (
        <>
          <Alert
            message="Successfully verified your email"
            type="success"
            showIcon
          />
          <Button type="primary" onClick={() => router.push("/")}>
            Go to login
          </Button>
        </>
      )}
    </div>
  );
};

export default Page;
