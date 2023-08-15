import React from "react";
import { Avatar as AntAvatar } from "antd";
import { UserOutlined } from '@ant-design/icons';

type Props = {
  url: string | undefined;
};

const Avatar = ({ url }: Props) => {
  return (
    <div>
      <AntAvatar src={url} size={104} icon={<UserOutlined />} draggable={false}></AntAvatar>
    </div>
  );
};

export default Avatar;
