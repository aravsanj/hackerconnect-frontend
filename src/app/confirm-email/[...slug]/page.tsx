"use client"
import { BASE_URL } from "@/app/config";
import axios from "axios";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
    const pathname = usePathname()
    const userId = pathname.split("/")[2]

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/verifyEmail`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    verifyEmail()
  }, [])

  return <div>Successfully verified your email</div>;
};

export default Page;
