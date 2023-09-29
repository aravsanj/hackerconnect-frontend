import React, { useEffect, useState } from "react";
import { Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PostActions from "./PostActions";
import ImageGrid from "./ImageGrid";
import Comments from "./Comments";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type Props = {
  post?: any;
};

const PostComponent = ({ post }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[] | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isReported, setIsReported] = useState(false);

  const postId = post?._id;

  const date = dayjs(post?.createdAt).fromNow();

  const loadComments = async () => {
    if (showComments) {
      setComments(undefined);
      setShowComments(false);
      setCurrentPage(1);
      return;
    }
    setShowComments(true);
    fetchComments();
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/getComments`,
        {
          postId,
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
    if (showComments) {
      fetchComments();
    }
  }, [showComments, currentPage]);

  if (isReported) {
    return (
      // <div className="flex items-center justify-center !w-full">
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <h1 className="text-2xl font-semibold mb-4">Reported Post</h1>
          <p className="text-gray-600 mb-4">
            This post has been reported and is temporarily hidden pending
            review.
          </p>

        </div>
      // </div>
    );
  }

  if (post) {
    return (
      <>
        <Card className="border  p-4 rounded-lg bg-white !mt-6">
          <div className="flex items-center mb-2">
            <Avatar src={`${post?.user?.profile}`} icon={<UserOutlined />} />
            <span className="font-bold ml-2">{`${post?.user?.firstName} ${post?.user?.lastName}`}</span>
            <span className="ml-2 text-xs text-slate-500">{date}</span>
          </div>
          <p className="ml-10">{`${post?.content}`}</p>
          <div className="ml-10">
            {post?.imageURLs?.length !== 0 && (
              <ImageGrid imageURLs={post?.imageURLs} />
            )}
          </div>

          <div className="flex justify-end items-center mt-6">
            <PostActions
              post={post}
              loadComments={loadComments}
              setIsReported={setIsReported}
            />
          </div>
          {showComments && (
            <Comments
              postId={post._id}
              comments={comments}
              setComments={setComments}
              nextPage={nextPage}
              currentPage={currentPage}
              fetchComments={fetchComments}
            />
          )}
        </Card>
      </>
    );
  }
};

export default PostComponent;
