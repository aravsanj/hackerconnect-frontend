import React, { useState } from "react";
import { Popover, List, Avatar, Badge, Button } from "antd";
import { BellFilled } from "@ant-design/icons";
import useUser from "../hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "../config";

const NotificationPopover: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const { notifications, user, updateNotifications, refetch } = useUser();

  const acceptConnection = async (
    connectionId: string,
    notificationId: string
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/acceptConnection`,
        {
          connectionId,
          notificationId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const rejectConnection = async (
    connectionId: string,
    notificationId: string,
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/rejectConnection`, 
        {
          connectionId,
          notificationId
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      refetch();
    } catch (e) {
      console.error(e);
    }
  }

  const unreadCount = notifications?.filter(
    (notification) => !notification?.hasRead
  ).length;

  function openNotification() {
    setVisible((vis) => !vis);
    updateNotifications();
  }

  function itemToRender(item: any) {
    if (item.type === "like") {
      return (
        <div className="pb-4 border-b border-b-gray-300">
          <Link href={`/${user?.username}/post/${item?.postId}`}>
            <List.Item
              className={`p-2 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-200`}
            >
              <List.Item.Meta
                avatar={
                  <span className="ml-2">
                    <Avatar src={item.senderId?.profile} />
                  </span>
                }
                title={<span>{item.message}</span>}
              />
            </List.Item>
          </Link>
        </div>
      );
    }

    if (item.type === "live") {
      return (
        <div className="pb-4 border-b border-b-gray-300">
          <a target="_blank" href={`/join-live/?roomName=${item?.roomName}`}>
            <List.Item
              className={`p-2 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-200`}
            >
              <List.Item.Meta
                avatar={
                  <span className="ml-2">
                    <Avatar src={item.senderId?.profile} />
                  </span>
                }
                title={<span>{item.message}</span>}
              />
            </List.Item>
          </a>
        </div>
      );
    }

    if (item.type === "comment") {
      return (
        <div className="pb-4 border-b border-b-gray-300">
          <Link href={`/${user?.username}/post/${item?.postId}`}>
            <List.Item
              className={`p-2 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-200`}
            >
              <List.Item.Meta
                avatar={
                  <span className="ml-2">
                    <Avatar src={item.senderId?.profile} />
                  </span>
                }
                title={<span>{item.message}</span>}
              />
            </List.Item>
          </Link>
        </div>
      );
    }


    if (item.type === "mention") {
      return (
        <div className="pb-4 border-b border-b-gray-300">
          <Link href={`/${user?.username}/post/${item?.postId}`}>
            <List.Item
              className={`p-2 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-200`}
            >
              <List.Item.Meta
                avatar={
                  <span className="ml-2">
                    <Avatar src={item.senderId?.profile} />
                  </span>
                }
                title={<span>{item.message}</span>}
              />
            </List.Item>
          </Link>
        </div>
      );
    }

    if (item.type === "connection_request") {
      const requestId = item.requestId;
      const notificationId = item._id;
      const hasAccepted = item.hasAccepted;

      const usernameBtn = (
        <Button
          onClick={() => router.push(`/${item?.senderId?.username}`)}
          type="link"
          className="!p-0 !m-0"
        >{`@${item.senderId?.username}`}</Button>
      );

      if (hasAccepted) {
        return (
          <div className="flex flex-col mb-2 pb-4 border-b border-b-gray-300">
            <List.Item className={`p-2 !border-b-0`}>
              <List.Item.Meta
                avatar={
                  <span className="ml-2">
                    <Avatar src={item.senderId?.profile} />
                  </span>
                }
                title={
                  <span>
                    {usernameBtn} {`is now your connection.`}
                  </span>
                }
              />
            </List.Item>
          </div>
        );
      }

 

      return (
        <div className="flex flex-col mb-2 pb-4 border-b border-b-gray-300">
          <List.Item className={`p-2 !border-b-0`}>
            <List.Item.Meta
              avatar={
                <span className="ml-2">
                  <Avatar src={item.senderId?.profile} />
                </span>
              }
              title={
                <span>
                  {usernameBtn} {`send you a connection request`}
                </span>
              }
            />
          </List.Item>

          <div className="mr-8 flex gap-x-2 self-end">
            <Button 
              onClick={() => rejectConnection(requestId, notificationId)}
  
            type="default">Reject</Button>
            <Button
              onClick={() => acceptConnection(requestId, notificationId)}
              type="primary"
            >
              Accept
            </Button>
          </div>
        </div>
      );
    }

    if (item.type === "connection_request_accepted") {
      return (
        <div className="pb-4 border-b border-b-gray-300">
          <Link href={`/${item?.senderId?.username}`}>
            <List.Item
              className={`p-2 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-200`}
            >
              <List.Item.Meta
                avatar={
                  <span className="ml-2">
                    <Avatar src={item.senderId?.profile} />
                  </span>
                }
                title={<span>{item.message}</span>}
              />
            </List.Item>
          </Link>
        </div>
      );
    }
  }

  

  const content = (
    <div className="notification-popover">
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => itemToRender(item)}
      />
    </div>
  );

  return (
    <Badge count={unreadCount}>
      <Popover
        content={content}
        title="Notifications"
        trigger="click"
        open={visible}
        onOpenChange={() => openNotification()}
        overlayStyle={{ width: "300px" }}
      >
        <BellFilled
          className="cursor-pointer"
          style={{ color: "white", fontSize: "20px" }}
        />
      </Popover>
    </Badge>
  );
};

export default NotificationPopover;
