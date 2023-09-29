"use client";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import { Avatar, Button, Table, Typography, Popconfirm } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profile: string;
}

type Props = {};

const BlockedUserSettings = (props: Props) => {
  const { user } = useUser();
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);

  const userId = user?._id;

  const fetchBlockersUsers = async () => {
    try {
      const response = await axios.post<User[]>(
        `${BASE_URL}/user/getBlockedUsers`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBlockedUsers(response.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchBlockersUsers();
  }, []);

  const unblockUser = async (userIdToUnblock: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/unblockUser`,
        { currentUserId: userId, userIdToUnblock },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      fetchBlockersUsers();
    } catch (e) {}
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "profile",
      key: "profile",
      render: (text: string, record: User) => <Avatar src={text} />,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) =>
        `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: User) => (
        <Popconfirm
          title={`Are you sure you want to unblock ${record.firstName}?`}
          onConfirm={() => unblockUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Unblock</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="mx-auto p-4 !w-full">
      <Title level={3} className="mb-4 text-gray-600">
        Blocked Users
      </Title>
      <Table
        className="!w-full"
        columns={columns}
        dataSource={blockedUsers}
        pagination={false}
        rowKey="_id"
      />
    </div>
  );
};

export default BlockedUserSettings;
