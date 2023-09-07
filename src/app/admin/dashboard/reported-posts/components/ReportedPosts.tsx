"use client";
import { Card, List, Button, Popconfirm, Image } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { DeleteOutlined } from "@ant-design/icons";

const ReportedPostsList = ({ reportedPosts, refetch }: any) => {
  const deletePost = async (postId: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/deletePost`,
        {
          postId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      refetch();
    } catch (e: any) {
      console.error(e);
    }
  };

  const ImageGrid = ({ imageURLs }: { imageURLs: string[] }) => {
    return (
      <div className="mt-2">
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          {imageURLs?.map((imageURL) => {
            return (
              <div key={imageURL} className="mr-6 inline">
                <Image
                  width="100px"
                  height="auto"
                  alt="imageURL"
                  src={imageURL}
                />
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
    );
  };
  console.log(reportedPosts);
  return (
    <List
      itemLayout="vertical"
      dataSource={reportedPosts}
      renderItem={(post: any) => (
        <List.Item>
          <Card
            title={`Reported Post by ${post.user.firstName} ${post.user.lastName}`}
            extra={
              <Button
                icon={<ExclamationCircleOutlined />}
                className="!flex !items-center !cursor-default"
                type="default"
              >
                Reported
              </Button>
            }
          >
            <p>{post.content}</p>
            {post?.imageURLs?.length !== 0 && (
              <ImageGrid imageURLs={post?.imageURLs} />
            )}
            <p>
              Reported by:{" "}
              {post.reports
                .map(
                  (report: any) =>
                    `${report.user.firstName} ${report.user.lastName} (${report.reason})`
                )
                .join(", ")}
            </p>

            <Popconfirm
              title="Deleting user post!"
              description="This action is irreversible. Are you sure you want to proceed?"
              onConfirm={() => deletePost(post._id)}
              okText="Proceed"
              cancelText="Cancel"
            >
              <Button
                className="bg-red-500 hover:bg-red-600 hover:border-none hover:!text-white text-white font-semibold py-2 px-4 rounded !flex !items-center mt-10"
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ReportedPostsList;
