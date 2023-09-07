"use client";
import React, { useEffect, useState } from "react";
import ReportedPostsList from "./components/ReportedPosts";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { useRouter } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const router = useRouter();

  const getReportedPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/getReportedPosts`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setReportedPosts(response.data);
    } catch (e: any) {
      console.error(e);
      router.push("/admin");
    }
  };

  const refetch = () => getReportedPosts();

  useEffect(() => {
    getReportedPosts();
  }, []);

  return <ReportedPostsList refetch={refetch} reportedPosts={reportedPosts} />;
};

export default Page;
