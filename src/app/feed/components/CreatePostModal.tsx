import { Modal, Button, Input, Form } from "antd";
import UserBadge from "./UserBadge";
import useUser from "@/app/hooks/useUser";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { useState } from "react";
import useFeed from "../hooks/useFeed";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CreatePostModal = ({ visible, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { refetch } = useFeed();
  const _id = user?._id;

  const submitPost = async (postContent: { content: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/post/createPost`,
        {
          ...postContent,
          _id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null}>
      <UserBadge
        name={`${user?.firstName} ${user?.lastName}`}
        profile={user?.profile}
      />
      <Form onFinish={submitPost} className="flex flex-col">
        <Form.Item name="content">
          <Input.TextArea
            placeholder="What do you want to talk about?"
            rows={10}
            bordered={false}
            className="!px-0"
            style={{ resize: "none" }}
          />
        </Form.Item>
        <Form.Item className="self-end p-2">
          <Button
            loading={loading}
            key="submit"
            type="primary"
            htmlType="submit"
          >
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
