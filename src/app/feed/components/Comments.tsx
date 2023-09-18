import { List, Avatar, Button } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MentionsInput,
  Mention,
  MentionItem,
  SuggestionDataItem,
} from "react-mentions";
import mentionInputStyles from "../styles/mentionInputStyles";
import mentionStyle from "../styles/mentionStyle";

dayjs.extend(relativeTime);

const pattern = /@\[([a-zA-Z0-9]+)\]\([a-f0-9]+\)/;
function replaceMentionsWithStyledText(text: string) {
  return text.replace(pattern, (match, mention) => {
    return `<a href="/${mention}" style="color: blue;">${mention}</a>`;
  });
}

const Comments = ({
  comments,
  postId,
  setComments,
  nextPage,
  currentPage,
}: {
  comments: any[] | undefined;
  postId: string;
  setComments: any;
  nextPage: () => void;
  currentPage: number;
}) => {
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<MentionItem[]>();

  const { user } = useUser();
  const connections = user?.connections;

  const addComment = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/addComment`,
        {
          content,
          mentions,
          userId: user?._id,
          postId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setContent("");
      setComments((prev: any) => [response.data.comment, ...prev]);
    } catch (e: any) {
      console.error(e);
    }
  };

  // * reminder: fix when there are no connections
  // @ts-ignore
  const suggestions: SuggestionDataItem[] = connections?.map((item, index) => ({
    id: item._id,
    display: item.username,
  }));

  return (
    <div className="mt-10 bg-gray-100 p-4 rounded-lg">
      <div className="mb-4 flex flex-col">
        {/* <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
          className="w-full !pr-4"
          style={{ flex: 1 }} // Expand to fill available space
          suffix={
            <span>
              <SendOutlined onClick={addComment} />
            </span>
          }
        /> */}
        <MentionsInput
          value={content}
          placeholder=" Add a comment"
          onChange={(e, newValue, newPlainTextValue, mentions) => {
            setMentions(mentions);
            setContent(newValue);
          }}
          style={mentionInputStyles}
          className="w-full"
        >
          <Mention
            trigger="@"
            data={suggestions}
            className="!focus:border-none"
            style={mentionStyle}
            renderSuggestion={(suggestion, search, highlightedDisplay) => (
              <div className="">{highlightedDisplay}</div>
            )}
          />
        </MentionsInput>
        <Button
          type="link"
          className="self-end mt-2"
          icon={<CommentOutlined />}
          onClick={addComment}
        >
          Comment
        </Button>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={comments}
        loading={!comments}
        locale={{
          emptyText: "Be the first to comment",
        }}
        loadMore={
          comments &&
          currentPage * 3 <= comments?.length && (
            <Button type="link" onClick={nextPage}>
              Load more
            </Button>
          )
        }
        renderItem={(comment, index) => {
          const date = dayjs(comment.createdAt).fromNow();
          const styledText = replaceMentionsWithStyledText(comment.content);
          const styledHtml = { __html: styledText };
          return (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={comment.user.profile}
                    alt={comment.user.firstName}
                  />
                }
                title={
                  <>
                    <span>
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="ml-2 text-xs	 text-slate-500">{date}</span>
                  </>
                }
                description={<span dangerouslySetInnerHTML={styledHtml}></span>}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default Comments;
