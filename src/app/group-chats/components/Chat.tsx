import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  Input,
  Button,
  Avatar,
  Drawer,
  List,
  Select,
  Popconfirm,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import { socket } from "@/app/socket.config";
import { UserAddOutlined, LeftCircleOutlined } from "@ant-design/icons";

const { Content } = Layout;

type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profile: string;
};

type GroupInfo = {
  _id: string;
  title: string;
  participants: UserProfile[];
  admins: UserProfile[];
  messages: any[];
  lastMessage: null | any;
};

function isUserAdmin(admins: any, userId: any) {
  for (let i = 0; i < admins.length; i++) {
    if (admins[i]._id === userId) {
      return true;
    }
  }
  return false;
}

const Chat: React.FC<{
  selectedGroup: string | null;
  setSelectedMenu: any;
}> = ({ selectedGroup, setSelectedMenu }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>();
  const [typing, setTyping] = useState(false);
  const [typeInfo, setTypeInfo] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  const { user, refetch } = useUser();
  const userId = user?._id;
  const name = user?.firstName + " " + user?.lastName;

  const connections = user?.connections.map((item) => ({
    label: `${item.firstName} ${item.lastName}`,
    value: item._id,
  }));

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const getGroupInfo = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/getGroupChatInfo`,
        { groupId: selectedGroup },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setGroupInfo(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/getMessages`,
        {
          chatId: selectedGroup,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMessages(response.data.messages);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/sendMessage`,
        {
          chatId: selectedGroup,
          senderId: userId,
          messageText: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessage("");
      getMessages();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMessages();
    getGroupInfo();
    socket?.emit("join-group", userId, selectedGroup);
    socket?.on("group-message-received", () => {
      getMessages();
      setTyping(false);
    });
    return () => {
      socket?.off("group-message-received");
    };
  }, [selectedGroup]);

  useEffect(() => {
    socket?.on("someone-typing-group", (name, message) => {
      if (message) {
        setTyping(true);
      } else {
        setTyping(false);
      }
      setTypeInfo(name);
    });
    return () => {
      socket?.off("someone-typing-group");
    };
  }, [selectedGroup]);

  const handleTyping = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    socket?.emit("sender-typing-group", selectedGroup, name, message);
  }, [message]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  });

  const adminParticipants = groupInfo?.participants.filter((participant) =>
    groupInfo?.admins.some((admin) => admin._id === participant._id)
  );
  const nonAdminParticipants = groupInfo?.participants.filter(
    (participant) =>
      !groupInfo?.admins.some((admin) => admin._id === participant._id)
  );

  if (!adminParticipants || !nonAdminParticipants) return null;

  const sortedParticipants = [...adminParticipants, ...nonAdminParticipants];

  const userSet = new Set(sortedParticipants.map((user) => user._id));

  const nonParticipants = connections?.filter(
    (connection) => !userSet.has(connection.value)
  );

  const isAdmin = isUserAdmin(adminParticipants, userId);

  const handleParticipantChange = (value: any) => {
    setParticipants(value);
  };

  const submitParticipants = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/addParticipants`,
        {
          chatId: selectedGroup,
          userIds: participants,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setParticipants([]);
      getGroupInfo();
    } catch (e) {
      console.error(e);
    }
  };

  const leaveChat = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/removeParticipant`,
        {
          chatId: selectedGroup,
          userId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      getGroupInfo();
      refetch();
      setSelectedMenu("");
    } catch (e: any) {
      console.error(e);
    }
  };

  const removeParticipant = async (userId: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/removeParticipant`,
        {
          chatId: selectedGroup,
          userId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      getGroupInfo();
    } catch (e: any) {
      console.error(e);
    }
  };

  const ChatDetails = (
    <Drawer
      title={groupInfo?.title}
      placement="right"
      onClose={() => setOpenDetails(false)}
      open={openDetails}
    >
      <List
        itemLayout="horizontal"
        dataSource={sortedParticipants}
        renderItem={(participant) => {
          const isAdmin = groupInfo?.admins.some(
            (admin) => admin._id === participant._id
          );

          const isLoggedInUserAdmin = groupInfo?.admins.some(
            (admin) =>
              admin._id === userId
          );

          return (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={participant.profile} />}
                title={`${participant.firstName} ${participant.lastName}`}
                description={
                  <>
                    {isAdmin && <span style={{ color: "green" }}>Admin</span>}
                    {!isAdmin && isLoggedInUserAdmin && (
                      <Popconfirm
                      placement="topRight"
                      title="Are you sure?"
                      description={`You're removing ${participant.firstName} ${participant.lastName}`}
                      onConfirm={() => removeParticipant(participant?._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        className="!p-0"
                        type="link"
                      >
                        Remove
                      </Button>
                      </Popconfirm>
                    )}
                  </>
                }
              />
            </List.Item>
          );
        }}
      />

      {isAdmin && (
        <div className="mt-4">
          <label className="block text-gray-700 font-bold mb-2">
            Add more participants
          </label>
          <Select
            mode="multiple"
            placeholder="Select participants"
            onChange={handleParticipantChange}
            className="w-full"
            popupClassName="bg-white shadow-lg"
            popupMatchSelectWidth={false}
            options={nonParticipants}
            value={participants}
          ></Select>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={submitParticipants}
            className="mt-4 !flex !items-center"
          >
            Add
          </Button>
        </div>
      )}
      <Popconfirm
        title="Leaving the chat"
        description="Are you sure to leave this chat?"
        onConfirm={leaveChat}
        // onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="default"
          icon={<LeftCircleOutlined />}
          className="mt-24 !flex !items-center m-auto"
        >
          Leave chat
        </Button>
      </Popconfirm>
    </Drawer>
  );

  return (
    <>
      {selectedGroup ? (
        <Layout className="h-screen">
          {ChatDetails}
          <div
            onClick={() => setOpenDetails(true)}
            className="bg-[#001529] p-2 h-[80px] flex items-center cursor-pointer"
          >
            <h2 className="text-xl text-white">{groupInfo?.title}</h2>
          </div>
          <Content className="h-full p-4 bg-gray-100 flex flex-col">
            <div
              className="h-full overflow-y-scroll"
              ref={messagesContainerRef}
            >
              {messages &&
                messages?.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === userId
                        ? "justify-end"
                        : "justify-start"
                    } mb-2 mr-4`}
                  >
                    {message.sender.id !== userId && (
                      <div className="mr-2">
                        <Avatar src={message.sender.avatarUrl} size={40} />
                      </div>
                    )}
                    <div
                      className={`p-2 max-w-md rounded-lg ${
                        message.sender.id === userId
                          ? "bg-blue-200 text-right"
                          : "bg-white text-left"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
            </div>
            {typing && (
              <span className="text-gray-500">{`${typeInfo} is typing...`}</span>
            )}
            <div className="flex items-center gap-x-6 mr-6">
              <Input
                placeholder="Type a message..."
                value={message}
                suffix={
                  <Button
                    type="default"
                    icon={<SendOutlined />}
                    onClick={sendMessage}
                    className="rounded-r-lg !border-none !flex !items-center"
                  ></Button>
                }
                onPressEnter={sendMessage}
                onChange={(e) => handleTyping(e)}
                className="flex-grow rounded-l-lg"
              />
            </div>
          </Content>
        </Layout>
      ) : (
        <p className="h-full flex items-center justify-center">
          Select a group to start chatting.
        </p>
      )}
    </>
  );
};

export default Chat;
