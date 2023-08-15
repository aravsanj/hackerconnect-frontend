import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

type Props = {
  name: string;
  profile: string | undefined;
};

const UserBadge = ({ name, profile }: Props) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Avatar src={profile} icon={<UserOutlined />} />
      <span className="font-semibold text-gray-700">{`Posting as ${name}`}</span>
    </div>
  );
};

export default UserBadge;
