import { Modal, Input } from "antd";
import UserBadge from "./UserBadge";
import useUser from "@/app/hooks/useUser";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { useState } from "react";
import useFeed from "../hooks/useFeed";
import ImageUpload from "./ImageUpload";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CreatePostModal = ({ visible, onClose }: Props) => {
  const { user } = useUser();
  const { updatePosts } = useFeed();
  const _id = user?._id;
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");

  const submitPost = async () => {
    const postContent = {
      content,
      imageURLs,
    };

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
      updatePosts(response.data.post)
    
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal open={visible} onCancel={onClose} okText="Submit" onOk={submitPost}>
      <UserBadge
        name={`${user?.firstName} ${user?.lastName}`}
        profile={user?.profile}
      />

      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What do you want to talk about?"
        rows={10}
        bordered={false}
        className="!px-0"
        style={{ resize: "none" }}
      />

      <ImageUpload setImageURLs={setImageURLs} />
    </Modal>
  );
};

export default CreatePostModal;
