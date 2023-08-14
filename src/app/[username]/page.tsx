"use client";

import Header from "./components/Header";
import { Col, Row } from "antd";
import About from "./components/About";
import RecentPosts from "./components/RecentPosts";
import useProfile from "./hooks/useProfile";

const Page = () => {
  const { profile } = useProfile();


  return (
    <Row>
      <Col offset={6} span={10}>
        <Header profile={profile} />
        <About about={profile?.about} />
        <RecentPosts />
      </Col>
    </Row>
  );
};

export default Page;
