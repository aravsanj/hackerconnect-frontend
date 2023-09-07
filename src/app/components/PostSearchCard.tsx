import React from "react";
import { Avatar } from "antd";

const PostSearchCard = ({ name, profile, content }: any) => {
  const truncateAndFade = (content: string, maxLength: number) => {
    if (content.length <= maxLength) {
      return content;
    }
    const truncatedContent = content.substring(0, maxLength);
    return (
      <>
        {truncatedContent}
        <span className="text-gray-500">...</span>
      </>
    );
  };

  return (
    <div className="flex flex-col p-4 border border-gray-300 rounded mb-4">
      <div className="flex items-center mb-2">
        <Avatar src={profile} alt="User Avatar" size={40} className="mr-2" />
        <span className="font-bold">{name}</span>
      </div>
      <div className="overflow-hidden">{truncateAndFade(content, 50)}</div>
    </div>
  );
};

export default PostSearchCard;
