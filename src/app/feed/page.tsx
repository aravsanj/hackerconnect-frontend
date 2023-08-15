"use client";

import { Col, Row } from "antd";
import NewPost from "./components/NewPost";
import Posts from "../components/Posts";
import FeedContextProvider from "./providers/FeedContextProvider";

export default function Page() {
  return (
    <Row>
      <Col offset={8} span={7}>
        <FeedContextProvider>
          <NewPost />
          <Posts />
        </FeedContextProvider>
      </Col>
    </Row>
  );
}
