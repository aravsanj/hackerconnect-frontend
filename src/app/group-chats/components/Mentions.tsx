import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import { socket } from "@/app/socket.config";
import { Avatar, List } from "antd";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  setHasUnreadMentions: Dispatch<SetStateAction<boolean>>
};

const Mentions = ({setHasUnreadMentions}: Props) => {
  const { user } = useUser();
  const [mentions, setMentions] = useState();

  const getMentionedMessages = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/getMentionedMessages`,
        {
          userId: user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMentions(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const updateReadStatus = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/changeReadStatus`,
        { userId: user?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setHasUnreadMentions(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMentionedMessages();
    updateReadStatus();
  }, []);


  const pattern = /@\[([a-zA-Z0-9]+)\]\([a-f0-9]+\)/;

  function replaceMentionsWithStyledText(text: string) {
    return text.replace(pattern, (match, mention) => {
      return `<span style="color: blue;">${mention}</span>`;
    });
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Mentions</h2>
      <List
        itemLayout="horizontal"
        dataSource={mentions}
        renderItem={(mention: any) => {
          const styledMessage = replaceMentionsWithStyledText(mention.message);
          const styledHtml = { __html: styledMessage };
          const title = (
            <span>
              {mention.sender.username} in{" "}
              <span className="text-gray-500">{mention.groupChat.title}</span>
            </span>
          );

          return (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={mention.sender.profile} />}
                title={title}
                description={<span dangerouslySetInnerHTML={styledHtml}></span>}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default Mentions;
