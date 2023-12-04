import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  Button,
  Avatar,
  Drawer,
  List,
  Select,
  Popconfirm,
  Popover,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import { socket } from "@/app/socket.config";
import {
  UserAddOutlined,
  LeftCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Mention,
  MentionItem,
  MentionsInput,
  SuggestionDataItem,
} from "react-mentions";
import mentionInputStyles from "@/app/feed/styles/mentionInputStylesGroupChat";
import mentionStyle from "@/app/feed/styles/mentionStyle";

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
  const [openMessageDetails, setOpenMessageDetails] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [mentions, setMentions] = useState<MentionItem[]>();
  const [messageText, setMessageText] = useState<any>();
  const [seenBy, setSeenBy] = useState<any[]>();

  const { user, refetch } = useUser();
  const userId = user?._id;
  const name = user?.firstName + " " + user?.lastName;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const userName = user?.username;
  const profile = user?.profile;

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
          mentions,
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

  const markAllMessagesAsRead = async () => {
    try {
      if (!selectedGroup) {
        throw new Error("no chat selected");
      }
      const response = await axios.post(
        `${BASE_URL}/group-chat/markAllMessagesAsSeen`,
        {
          chatId: selectedGroup,
          userId: userId,
          firstName,
          lastName,
          userName,
          profile,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMessages();
    getGroupInfo();
    markAllMessagesAsRead();
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

  // @ts-ignore
  const suggestions: SuggestionDataItem[] = sortedParticipants
    ?.map((item, index) => ({
      id: item._id,
      display: item.username,
    }))
    .filter((item, index) => item.id !== user?._id);

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
            (admin) => admin._id === userId
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
                        <Button className="!p-0" type="link">
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

  const fetchSeenStatus = async (messageInfo: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/fetchSeenStatus`,
        { groupChatId: selectedGroup, messageId: messageInfo.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSeenBy(response.data.seenBy);
    } catch (e: any) {
      console.error(e);
    }
  };

  const deliveredTo = sortedParticipants.filter((participant) => {
    return !seenBy?.some((seen) => participant.username === seen.username) && !(participant._id === userId);
  })

  const openMessageDetailsDrawer = (messageInfo: any) => {
    const styledMessage = replaceMentionsWithStyledText(messageInfo.text);
    const styledHtml = { __html: styledMessage };
    fetchSeenStatus(messageInfo);
    setMessageText(styledHtml);
    setOpenMessageDetails(true);
  };

  const MessageDetails = (
    <Drawer
      title="Message details"
      placement="right"
      onClose={() => setOpenMessageDetails(false)}
      open={openMessageDetails}
    >
      <span
        className="p-2 bg-blue-100 rounded-lg"
        dangerouslySetInnerHTML={messageText}
      ></span>
      <span className="block my-2 mt-10 font-semibold">Seen by: </span>
      {seenBy?.length !== 0 && (
        <List
          itemLayout="horizontal"
          dataSource={seenBy}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.profile} />}
                title={`${item.firstName} ${item.lastName}`}
              />
            </List.Item>
          )}
        />
      )}
      <span className="block my-2 mt-10 font-semibold">Delivered to: </span>

        <List
          itemLayout="horizontal"
          dataSource={deliveredTo}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.profile} />}
                title={`${item.firstName} ${item.lastName}`}
              />
            </List.Item>
          )}
        />
      
    </Drawer>
  );

  const pattern = /@\[([a-zA-Z0-9]+)\]\([a-f0-9]+\)/;
  function replaceMentionsWithStyledText(text: string) {
    return text.replace(pattern, (match, mention) => {
      return `<span style="color: blue;">${mention}</span>`;
    });
  }

  return (
    <>
      {selectedGroup ? (
        <Layout className="h-screen">
          {ChatDetails}
          {MessageDetails}
          <div
            onClick={() => setOpenDetails(true)}
            className="bg-[#001529] p-2 h-[80px] flex items-center cursor-pointer"
          >
            <h2 className="text-xl text-white">{groupInfo?.title}</h2>
          </div>
          <Content className="h-full p-4 bg-gradient-to-r from-gray-200 to-gray-100 flex flex-col">
            <div
              className="h-full overflow-y-scroll custom-scrollbar"
              ref={messagesContainerRef}
            >
              {messages &&
                messages?.map((message: any) => {
                  const styledMessage = replaceMentionsWithStyledText(
                    message.text
                  );
                  const styledHtml = { __html: styledMessage };

                  return (
                    <div
                      key={message.id}
                      className={`relative flex ${
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
                      {message.sender.id === userId ? (
                        <Popover
                          content={
                            <Button
                              type="primary"
                              onClick={() => {
                                openMessageDetailsDrawer(message);
                              }}
                              className="!flex !items-center"
                            >
                              <InfoCircleOutlined /> Info
                            </Button>
                          }
                          trigger="hover"
                          placement="topRight"
                        >
                          <div
                            className={`p-2 max-w-md rounded-lg ${
                              message.sender.id === userId
                                ? "bg-blue-200 text-right"
                                : "bg-white text-left"
                            }`}
                            dangerouslySetInnerHTML={styledHtml}
                          ></div>
                        </Popover>
                      ) : (
                        <div
                          className={`p-2 max-w-md rounded-lg ${
                            message.sender.id === userId
                              ? "bg-blue-200 text-right"
                              : "bg-white text-left"
                          }`}
                          dangerouslySetInnerHTML={styledHtml}
                        ></div>
                      )}
                    </div>
                  );
                })}
            </div>
            {typing && (
              <span className="text-gray-500">{`${typeInfo} is typing...`}</span>
            )}
            <div className="flex items-center gap-x-6 mr-6">
              <MentionsInput
                value={message}
                placeholder="Type a message..."
                onChange={(e, newValue, newPlainTextValue, mentions) => {
                  setMentions(mentions);
                  handleTyping(e);
                }}
                style={mentionInputStyles}
                singleLine
                className="!w-full"
              >
                <Mention
                  trigger="@"
                  data={suggestions}
                  className="!focus:border-none"
                  style={mentionStyle}
                  renderSuggestion={(
                    suggestion,
                    search,
                    highlightedDisplay
                  ) => <div className="">{highlightedDisplay}</div>}
                />
              </MentionsInput>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                className="!rounded-sm !border-none !flex !items-center"
              >
                Send
              </Button>
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
