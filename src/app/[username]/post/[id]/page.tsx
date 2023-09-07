"use client";
import { BASE_URL } from "@/app/config";
import PostComponent from "@/app/feed/components/Post";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [post, setPost] = useState<any>(null);
  const path = usePathname();
  const postId = path.split("/")[3];

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/post/${postId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const postData = response.data.post;

      setPost(postData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-[500px] ">
        <PostComponent post={post} />
      </div>
    </div>
  )
};

export default Page;
