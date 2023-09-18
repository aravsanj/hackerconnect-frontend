"use client";

import { Col, Row } from "antd";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import FeedContextProvider from "./providers/FeedContextProvider";
import CustomCard from "./components/CustomCard";
import RecommendationList from "./components/RecommendationList";
import dynamic from "next/dynamic";
import CreateGroupChatButton from "./components/CreateGroupChat";
import GroupListCard from "./components/GroupList";

const ConnectionList = dynamic(() => import("./components/ConnectionList"), {
  ssr: false, 
});

export default function Page() {
  return (
    <>
      <Row>
        <Col xs={{ span: 0 }} sm={{ span: 0 }} xxl={{ offset: 3, span: 4 }}>
          <div className="flex flex-col gap-y-4 justify-center items-center w-full">
            <CustomCard />
            <CreateGroupChatButton />
            <GroupListCard />
          </div>
        </Col>
        <Col
          xs={{ offset: 1, span: 22 }}
          sm={{ offset: 3, span: 18 }}
          md={{ offset: 1, span: 14 }}
          xl={{ offset: 3, span: 12 }}
          xxl={{ offset: 1, span: 8 }}
        >
          <FeedContextProvider>
            <NewPost />
            <Posts />
          </FeedContextProvider>
        </Col>
        <Col
          xs={{ span: 0 }}
          md={{ offset: 1, span: 7 }}
          xl={{ offset: 1, span: 5 }}
          xxl={{ offset: 1, span: 4 }}
        >
          <ConnectionList />
          <RecommendationList />
        </Col>
      </Row>
    </>
  );
}
