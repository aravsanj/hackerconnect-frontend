import React from "react";
import { Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PostActions from "../feed/components/PostActions";

type Props = {
  post: any;
};

const PostComponent = ({ post }: Props) => {
  if (post) {
    return (
      <Card className="border p-4 rounded bg-white !mt-6">
        <div className="flex items-center mb-2">
          <Avatar src={`${post?.user?.profile}`} icon={<UserOutlined />} />
          <span className="font-bold ml-2">{`${post?.user?.firstName} ${post?.user?.lastName}`}</span>
        </div>
        <p className="ml-10">{`${post?.content}`}</p>
        <div className="flex justify-end items-center mt-6">
          <PostActions />
        </div>
      </Card>
    );
  }
};

export default PostComponent;
