import { Avatar, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "@/app/config";

const NetworkCard = ({
  name,
  profile,
  cover,
  title,
  senderId,
  receiverId,
  refetch,
}: any) => {
  const handleRemove = async () => {
    try {
      await axios.post(
        `${BASE_URL}/user/removeConnection`,
        {
          senderId,
          receiverId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[300px] mt-10 bg-white rounded-xl w-[280px]">
      <div
        className="h-[30%] rounded-tl-xl rounded-tr-xl relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${cover})`,
        }}
      ></div>

      <div className="flex-grow flex flex-col items-center">
        <Avatar draggable={false} className="!-mt-10" size={80} src={profile} />
      </div>
      <div className="flex-grow flex flex-col items-center">
        <h3 className="text-lg font-semibold	">{name}</h3>
        <span>{title}</span>
      </div>
      <div className="flex justify-center mt-10">
        <Button
          type="default"
          danger
          icon={<DeleteOutlined size={24} />}
          className="inline-flex items-center"
          onClick={handleRemove}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default NetworkCard;
