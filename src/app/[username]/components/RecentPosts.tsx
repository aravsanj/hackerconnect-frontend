import { Typography } from "antd";
import React from "react";

type Props = {};

const RecentPosts = (props: Props) => {
  return (
    <div className="flex flex-col my-8 p-10 rounded-xl bg-[#E1E8ED] relative">
      <Typography.Title level={4} className="mb-0 pb-0">
        Recent Posts
      </Typography.Title>
    </div>
  );
};

export default RecentPosts;
