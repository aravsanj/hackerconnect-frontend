import { useEffect, useState } from "react";
import { Mention, MentionItem, MentionsInput } from "react-mentions";
import mentionInputStyles from "../styles/mentionInputStyles";
import mentionStyle from "../styles/mentionStyle";
import { Avatar, Button, List, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import relativeTime from "dayjs/plugin/relativeTime";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

const pattern = /@\[([a-zA-Z0-9]+)\]\([a-f0-9]+\)/;
function replaceMentionsWithStyledText(text: string) {
  return text.replace(pattern, (match, mention) => {
    return `<a href="/${mention}" style="color: blue;">${mention}</a>`;
  });
}

type Props = {};

const Reply = ({ suggestions, postId, parentCommentId }: any) => {
  const [showReplies, setShowReplies] = useState(false);
  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState<any[] | undefined>();
  const [mentions, setMentions] = useState<MentionItem[]>();
  const { user } = useUser();

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/getReplies`,
        {
          parentCommentId,
          currentPage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (comments) {
        setComments((prevComments: any) => [
          ...prevComments,
          ...response.data.comments,
        ]);
      } else {
        setComments(response.data.comments);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (showReplies) {
      fetchComments();
    }
  }, [showReplies, currentPage]);

  const addReply = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/addReply`,
        {
          content,
          mentions,
          userId: user?._id,
          postId,
          parentCommentId,
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

  const toggleInputVisibility = () => {
    setShowReplies(!showReplies);
    setComments([]);
    setCurrentPage(1);
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/deleteComment`,
        { commentId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setComments((prev: any) => {
        const newComments = prev.filter((pre: any) => pre._id !== commentId);
        return newComments;
      });
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div>
      <Button
        type="text"
        onClick={toggleInputVisibility}
        className="text-gray-500 hover:text-gray-700 focus:outline-none !text-xs"
        style={{ border: "none", background: "transparent" }}
      >
        {showReplies ? "Hide replies" : "See replies"}
      </Button>
      {showReplies && (
        <div className="flex flex-col">
          <MentionsInput
            value={content}
            placeholder="Add a reply"
            onChange={(e, newValue, newPlainTextValue, mentions) => {
              setMentions(mentions);
              setContent(newValue);
            }}
            style={mentionInputStyles}
            className="w-full ml-2"
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
          <Button type="link" className="self-end mt-2" onClick={addReply}>
            Post
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={comments}
            loading={!comments}
            locale={{
              emptyText: "Be the first to reply",
            }}
            loadMore={
              comments &&
              currentPage * 3 <= comments?.length && (
                <Button type="link" onClick={nextPage}>
                  Load more
                </Button>
              )
            }
            renderItem={(comment: any, index) => {
              const date = dayjs(comment.createdAt).fromNow();
              const styledText = replaceMentionsWithStyledText(comment.content);
              const styledHtml = { __html: styledText };
              return (
                <List.Item
                  // actions={[
                  //   comment.user._id === user?._id && (
                  //     <Popconfirm
                  //       key="delete"
                  //       title="Are you sure you want to delete this comment?"
                  //       // onConfirm={() => deleteComment(comment._id)}
                  //       okText="Yes"
                  //       cancelText="No"
                  //     >
                  //       <Button
                  //         type="text"
                  //         icon={<DeleteOutlined />}
                  //         danger
                  //       ></Button>
                  //     </Popconfirm>
                  //   ),
                  // ]}
                >
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
                        <span className="ml-2 text-xs text-slate-500">
                          {date}
                        </span>
                        {comment.user._id === user?._id && (
                          <Popconfirm
                            key="delete"
                            title="Are you sure you want to delete this comment?"
                            onConfirm={() => deleteComment(comment._id)}
                            okText="Yes"
                            cancelText="No"
                            className="!self-end"
                          >
                            <Button
                              type="text"
                              icon={
                                <DeleteOutlined className="!text-xs !p-0 !m-0" />
                              }
                              size="small"
                            ></Button>
                          </Popconfirm>
                        )}
                      </>
                    }
                    description={
                      <>
                        <span dangerouslySetInnerHTML={styledHtml}></span>
                        {/* <Reply
                          suggestions={suggestions}
                          postId={postId}
                          parentCommentId={comment._id}
                        /> */}
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Reply;
