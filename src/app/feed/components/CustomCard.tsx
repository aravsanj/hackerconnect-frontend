import React from "react";
import { Avatar } from "antd";
import useUser from "@/app/hooks/useUser";

const CustomCard = () => {
  const { user } = useUser();

  return (
    <div className="h-[250px] mt-10 bg-white rounded-xl">
      <div
        className="h-[45%] rounded-tl-xl rounded-tr-xl relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${user?.cover ? user?.cover : "1062.jpg"})`,
        }}
      ></div>

      <div className="flex-grow flex flex-col items-center">
        <Avatar draggable={false} className="!-mt-10" size={80} src={user?.profile} />
      </div>
      <div className="flex-grow flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold	">{user?.firstName} {user?.lastName}</h3>
        <span>{user?.title}</span>
      </div>
    </div>
  );
};

export default CustomCard;
