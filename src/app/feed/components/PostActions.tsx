import React from "react";
import { Button, Space, Tooltip } from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const PostActions = () => {
  return (
    <Space size="large">
      <Tooltip title="Like">
        <Button icon={<HeartOutlined />} />
      </Tooltip>
      <Tooltip title="Comment">
        <Button icon={<CommentOutlined />} />
      </Tooltip>
      <Tooltip title="Share">
        <Button icon={<ShareAltOutlined />} />
      </Tooltip>
    </Space>
  );
};

export default PostActions;
