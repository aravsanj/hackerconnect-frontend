import { Card, Typography, Avatar } from "antd";
import { profile } from "../contexts/profileContext";

type Props = {
  posts: any[] | undefined;
  profile: profile | undefined;
};

const RecentPosts = ({ posts, profile }: Props) => {
  return (
    <div className="flex flex-col my-8 p-10 rounded-xl bg-[#fff] relative">
      <Typography.Title level={4} className="mb-0 pb-0">
        Recent Posts
      </Typography.Title>
      {posts?.map((post, index) => {
        return (
          <>
            <Card className="border rounded bg-white !mt-6 ">
              <div className="flex items-center mb-2">
                <Avatar src={profile?.profile}  />
                <span className="font-bold ml-2">{`${profile?.firstName} ${profile?.lastName}`}</span>
              </div>
              <p className="ml-10">{`${post?.content}`}</p>
            </Card>
          </>
        );
      })}
    </div>
  );
};

export default RecentPosts;
