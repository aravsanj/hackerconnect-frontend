import { List, Avatar, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
  const { user } = useUser();

  const addComment = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/addComment`,
        {
          content,
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

  console.log(comments);
  return (
    <div className="mt-10 bg-gray-100 p-4 rounded-lg">
      <div className="mb-4 flex">
        <Input
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
        />
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
                description={comment.content}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default Comments;
