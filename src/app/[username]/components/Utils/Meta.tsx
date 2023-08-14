import { Skeleton, Typography } from "antd";

const Meta = ({ profile }: any) => {
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

      <Typography.Text className="mt-6">{`${title}`}</Typography.Text>
    </div>
  );
};

export default Meta;
