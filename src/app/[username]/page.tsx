"use client";

import Header from "./components/Header";
import { Button, Col, Empty, Row, Spin } from "antd";
import About from "./components/About";
import RecentPosts from "./components/RecentPosts";
import useProfile from "./hooks/useProfile";
import { useRouter } from "next/navigation";
import useUser from "../hooks/useUser";

const Page = () => {
  const { profile, posts, hasReceivedFirstResponse } = useProfile();
  const { user } = useUser();

  const router = useRouter();
  const isLoggedIn = user?.isLoggedIn;

 

  if (!isLoggedIn) {
    return (
      <span className="flex justify-center items-center mt-[200px]">
        <Empty
          description={
            <div className="flex flex-col">
              <span className="text-2xl text-gray-900">
                Please login to view
              </span>
              <Button onClick={() => router.push("/")} type="link">
                Login
              </Button>
            </div>
          }
        />
      </span>
    );
  }

  if (hasReceivedFirstResponse && !profile) {
    return (
      <span className="flex justify-center items-center mt-[200px]">
        <Empty
          description={
            <div className="flex flex-col">
              <span className="text-2xl text-gray-900">
                🕵️‍♂️ Hey, nothing&apos;s up here... yet!🚀
              </span>
              <Button onClick={() => router.push("/feed")} type="link">
                Home
              </Button>
            </div>
          }
        />
      </span>
    );
  }

  return (
    <Row justify="center">
      <Col xs={22} sm={22} md={20} lg={18} xl={14} xxl={10}>
        <Header profile={profile} />
        <About profile={profile} />
        <RecentPosts profile={profile} posts={posts} />
      </Col>
    </Row>
  );
};

export default Page;
