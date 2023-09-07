import useUser from "@/app/hooks/useUser";
import { Skeleton, Typography } from "antd";

const Meta = ({ profile }: any) => {
  const { user } = useUser();
  const sameUser = user?._id === profile?._id;

  if (!profile) {
    return (
      <Skeleton
        active={true}
        paragraph={{ rows: 2 }}
        className="mt-2"
      ></Skeleton>
    );
  }
  const { firstName, lastName, username, title } = profile;

  return (
    <div className="flex flex-col">
      <Typography.Title level={4} className="mb-0 pb-0">
        {`${firstName} ${lastName}`}
      </Typography.Title>

      <Typography.Text type="secondary" className="-mt-4 pt-0">
        @{`${username}`}
      </Typography.Text>

      {title ? (
        <Typography.Text className="mt-6">{title}</Typography.Text>
      ) : sameUser ? (
        <p className="text-gray-600 mt-6">
          Unlock your story: add your title and inspire others!
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default Meta;
