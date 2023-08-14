import React from "react";
import { Avatar as AntAvatar } from "antd";

type Props = {
  url: string | undefined;
};

const Avatar = ({ url }: Props) => {
  return (
    <div>
      <AntAvatar src={url} size={104} draggable={false}></AntAvatar>
    </div>
  );
};

export default Avatar;
