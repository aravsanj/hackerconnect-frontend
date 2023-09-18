import useUser from "@/app/hooks/useUser";
import { Button } from "antd";
import { LinkOutlined } from '@ant-design/icons';


type GroupName = {
  _id: string;
  title: string;
};

type GroupNames = GroupName[];

const GroupListCard = () => {
  const { user } = useUser();
  const groupNames: GroupNames = user?.groupInfo;
  

  return (
    <div className="bg-white rounded-xl p-4 w-[300px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Group Chats
      </h2>
      <ul>
        {groupNames.map((groupName, index) => (
          <li
            key={index}
            className="text-gray-700 font-medium border-b border-gray-300 py-2"
          >
            {groupName.title}
          </li>
        ))}
      </ul>
      <Button type="link" className="mt-6 !px-0">
        <a
          href="http://localhost:3000/group-chats"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open group chats
          <LinkOutlined style={{ marginLeft: '4px' }} />
        </a>
      </Button>
    </div>
  );
};

export default GroupListCard;
