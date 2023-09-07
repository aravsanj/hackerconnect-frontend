import { Card, Typography, Avatar } from "antd";
import { profile } from "../contexts/profileContext";
import PostComponent from "@/app/feed/components/Post";

type Props = {
  posts: any[] | undefined;
  profile: profile | undefined;
};

const RecentPosts = ({ posts }: Props) => {
  return (
    <div className="flex flex-col my-8 p-10 rounded-xl bg-[#fff] relative">
      <Typography.Title level={4} className="mb-0 pb-0">
        Recent Posts
      </Typography.Title>
      <div className="px-24">
        {posts?.map((post, index) => {
          return (
            <>
              <PostComponent post={post} />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default RecentPosts;
