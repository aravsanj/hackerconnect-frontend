import React from "react";
import { Button } from "antd";
import {
  UserAddOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import useUser from "@/app/hooks/useUser";
import useProfile from "../../hooks/useProfile";
import axios from "axios";
import { BASE_URL } from "@/app/config";

const ConnectButton = () => {
  const { user } = useUser();
  const { profile, connectionStatus, refetch } = useProfile();

  const senderId = user?._id;
  const receiverId = profile?._id;

  const handleConnect = async () => {
    try {
      await axios.post(
        `${BASE_URL}/user/sendConnection`,
        {
          senderId,
          receiverId,
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

  const handleRemove = async () => {
    try {
      await axios.post(
        `${BASE_URL}/user/removeConnection`,
        {
          senderId,
          receiverId,
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

  const getButtonIcon = () => {
    if (connectionStatus === "notConnected") {
      return <UserAddOutlined />;
    } else if (connectionStatus === "pending") {
      return <CloseCircleOutlined />;
    } else if (connectionStatus === "accepted") {
      return <DisconnectOutlined />;
    }
  };

  const getButtonText = () => {
    if (connectionStatus === "notConnected") {
      return "Connect";
    } else if (connectionStatus === "pending") {
      return "Pending";
    } else if (connectionStatus === "accepted") {
      return "Remove";
    }
  };

  return (
    <Button
      type={connectionStatus === "notConnected" ? "primary" : "default"}
      icon={getButtonIcon()}
      className={`self-end mr-4`}
      onClick={connectionStatus === "notConnected" ? handleConnect : handleRemove}
      style={{ width: "140px" }}
    >
      {getButtonText()}
    </Button>
  );
};

export default ConnectButton;
