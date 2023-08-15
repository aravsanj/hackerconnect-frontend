import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useUser from "@/app/hooks/useUser";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";

const NewPost = () => {
  const { user } = useUser();

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
    <CreatePostModal visible={modalVisible} onClose={closeModal} />
    <div className="border p-4 rounded-xl bg-white shadow mt-10">
      <div className="flex items-center mb-2">
        <Avatar src={user?.profile} icon={<UserOutlined />} />
        <span className="font-bold ml-2">
          {user?.firstName} {user?.lastName}
        </span>
      </div>
      <div className="mb-2 mt-6">
        <div className="mb-2">
          <div
            onClick={openModal}
            className="border rounded-xl p-2 bg-gray-50 focus:bg-white transition duration-300 ease-in-out focus-within:ring-2 focus-within:ring-blue-300 cursor-pointer"
          >
            <p className="text-gray-500">Start a post...</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewPost;
