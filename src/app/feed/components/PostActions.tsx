import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Tooltip,
  Dropdown,
  Menu,
  Popover,
  List,
  Avatar,
  message,
} from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  HeartFilled,
  MoreOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import useUser from "@/app/hooks/useUser";
import { BASE_URL } from "@/app/config";
import ReportForm from "./ReportForm";

const PostActions = ({ post, loadComments, setIsReported }: any) => {
  const [userLiked, setUserLiked] = useState(post?.userLiked);
  const [userLikes, setUserLikes] = useState([]);
  const [open, setOpen] = useState(false);

  const { user } = useUser();
  const userId: string | undefined = user?._id;
  const postId: string = post?._id;
  const postUserId = post?.user?._id;
  const likes = post.likes;

  useEffect(() => {
    setUserLikes(likes);
  }, []);

  const likesPopoverContent = (
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={userLikes}
      renderItem={(like: any) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={like.profile} />}
            title={like.username}
          />
        </List.Item>
      )}
    />
  );

  const likePostHandle = async (
    postId: string,
    userId: string | undefined,
    postUserId: string
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/likePost`,
        {
          postId: postId,
          senderId: userId,
          userId: postUserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUserLiked(!userLiked);
        setUserLikes(response.data.post.likes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoreOption = (key: string) => {
    switch (key) {
      case "report":
        break;
      case "save":
        break;
      default:
        break;
    }
  };

  const openReport = async () => {
    setOpen(true);
  }

  const closeReport = async () => {
    setOpen(false)
  }

  const reportPost = async (value: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/report`,
        { postId, userId, value },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setIsReported(true)
      message.info("Post reported successfully!")
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (value: any) => {
    reportPost(value);
  }



  const icon = userLiked ? (
    <HeartFilled style={{ color: "red" }} />
  ) : (
    <HeartOutlined />
  );

  const menuItems = [
    {
      key: "save",
      label: "Save Post",
      icon: <SaveOutlined />,
    },
    {
      key: "report",
      label: "Report Post",
      icon: <ExclamationCircleOutlined />,
      action: openReport,
    },
  ];

  return (
    <Space size="large">
      <ReportForm open={open} onCancel={closeReport} onSubmit={onSubmit} />
      <Popover content={likesPopoverContent} title="Liked by" placement="top">
        <Tooltip title="Like">
          <Button
            onClick={() => likePostHandle(postId, userId, postUserId)}
            icon={icon}
          />
        </Tooltip>
      </Popover>
      <Tooltip title="Comment">
        <Button onClick={loadComments} icon={<CommentOutlined />} />
      </Tooltip>
      <Tooltip title="Share">
        <Button icon={<ShareAltOutlined />} />
      </Tooltip>
      <Dropdown
        overlay={
          <Menu onClick={(e) => handleMoreOption(e.key)}>
            {menuItems.map((item) => (
              <Menu.Item onClick={item.action} key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        }
        trigger={["click"]}
      >
        <Button icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

export default PostActions;
