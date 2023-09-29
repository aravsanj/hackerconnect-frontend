import CoverPhoto from "./Utils/CoverPhoto";
import Avatar from "./Utils/Avatar";
import Meta from "./Utils/Meta";
import UpdateModal from "./UpdateUserModal";
import { profile } from "../contexts/profileContext";
import useUser from "../../hooks/useUser";
import ConnectButton from "./Utils/ConnectButton";
import { Button, Popconfirm } from "antd";
import { BlockOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { useRouter } from "next/navigation";

const Header = ({ profile }: { profile: profile | undefined }) => {
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;
  const sameUser = user?._id === profile?._id;
  const router = useRouter()

  const handleBlockUser = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/blockUser`,
        {
          currentUserId: user?._id,
          userIdToBlock: profile?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      router.push("/feed");
    } catch (e) {}
  };

  return (
    <div className="flex flex-col mt-16 h-[400px] rounded-xl bg-[#fff] relative">
      <CoverPhoto url={profile?.cover} />
      <div className="flex flex-col p-4 ml-6 -mt-20">
        <Avatar url={profile?.profile} />
        <Meta profile={profile} />
      </div>

      {isLoggedIn && sameUser && (
        <div className="self-end pr-12">
          <UpdateModal profile={profile} />
        </div>
      )}

      {isLoggedIn && !sameUser && (
        <div className="self-end pr-12">
          <ConnectButton />
          <Popconfirm
            title="Are you sure you want to block this user?"
            onConfirm={handleBlockUser}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<BlockOutlined />} >
              Block User
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
};

export default Header;
