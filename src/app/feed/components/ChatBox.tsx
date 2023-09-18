"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";

type Props = {
  receiverId: string;
  senderId: string;
  name: string;
  closeChat: (receiverId: string) => void;
  index?: number;
};


const Message = ({  message, isSender }: {
  message: string;
  isSender: boolean;
}) => {
  const receiverStyle =
    "max-w-[80%] w-max rounded-lg p-2 bg-[#2F3336] mt-2 text-white";
  const senderStyle =
    "max-w-[80%] w-max rounded-lg p-2 bg-[#1DA1F2] mt-2 text-white self-end";

  return (
    <div className={isSender ? senderStyle : receiverStyle}>{message}</div>
  );
};

const ChatBox = ({ receiverId, senderId, closeChat, name, index }: Props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState<boolean>();

  const { user, refetch } = useUser();
  const receiverName = `${user?.firstName} ${user?.lastName}`;

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useUser();

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      try {
        const response = await axios.post(
          `${BASE_URL}/chat/sendMessage`,
          {
            name: receiverName,
            senderId: senderId,
            receiverId: receiverId,
            content: message,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setMessages((prev) => [...prev, response.data.lastMessage]);
      } catch (e: any) {
        console.error(e);
      }
      setMessage("");
    }
  };

  const sortedUserIds = [senderId, receiverId].sort((a, b) =>
    a.toString().localeCompare(b.toString())
  );

  const chatIdentifier = sortedUserIds.join("_");

  const getMessages = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/chat/getMessages`,
        {
          identifier: chatIdentifier,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessages(response.data.sortedMessages);
      refetch();
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    socket?.on("message-received", () => {
      getMessages();
      setTyping(false);
    });
    return () => {
      socket?.off("message-received");
    };
  });

  useEffect(() => {
    socket?.on(
      "sender-typing",
      (item: { chatIdentifier: string; message: string }) => {
        if (item.message && item.chatIdentifier === chatIdentifier) {
          setTyping(true);
        } else {
          setTyping(false);
        }
      }
    );
  });

  const handleTyping = (e: any) => {
    setMessage(e.target.value);
    socket?.emit("message-typing", {
      receiverId: receiverId,
      chatIdentifier: chatIdentifier,
      message: e.target.value,
    });
  };


  return (
    <div className={`fixed bottom-0 right-[30vw] z-30`}>
      <div className="w-[350px] h-[400px] border-x-[1]  border-gray-400 bg-white shadow-md rounded-t-lg flex flex-col justify-between">
        <div className="rounded-t-lg bg-[#1D9BF0] flex justify-between items-center px-4">
          {typing ? (
            <div className="text-white py-2">{name} is typing... </div>
          ) : (
            <div className="text-white py-2">{name}</div>
          )}
          <button
            className="text-white hover:text-gray-700"
            onClick={() => closeChat(receiverId)}
          >
            <CloseOutlined />
          </button>
        </div>
        <div
          className="p-2 flex flex-col h-full overflow-y-scroll"
          ref={messagesContainerRef}
        >
          {messages &&
            messages.map((message, index) => (
              <Message
                key={index}
                message={message.message}
                isSender={message.sender === senderId}
              />
            ))}
        </div>

        <div className="w-full ">
          <Input
            placeholder="Type a message..."
            suffix={<SendOutlined onClick={handleSendMessage} />}
            onPressEnter={handleSendMessage}
            value={message}
            className="!rounded-none"
            onChange={(e) => handleTyping(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
