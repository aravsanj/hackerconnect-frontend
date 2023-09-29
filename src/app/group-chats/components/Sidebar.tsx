import React, { useEffect, useState } from "react";
import { Badge, Layout, Menu } from "antd";
import Chat from "./Chat";
import useUser from "@/app/hooks/useUser";
import Mentions from "./Mentions";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { socket } from "@/app/socket.config";

const { Sider } = Layout;

const Sidebar = () => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [hasUnreadMentions, setHasUnreadMentions] = useState(false);
  const { user } = useUser();

  const checkUnreadMentions = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/hasUnreadMessages`,
        { userId: user?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setHasUnreadMentions(response.data.hasUnread)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkUnreadMentions();
  }, [user?._id]);

  useEffect(() => {
    socket?.on("group-mention", () => {
      checkUnreadMentions();
    })
    return () => {
      socket?.off("group-mention");
    };
  }, [])


  type groupType = {
    _id: string;
    title: string;
  };

  const groups: groupType[] = user?.groupInfo;

  const handleMenuSelect = (e: any) => {
    setSelectedMenu(e.key);
  };

  if (!groups) {
    return (
      <>
        <div>Loading..</div>
      </>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={340} theme="dark">
        <div className="h-16 flex items-center justify-center text-2xl text-white font-semibold">
          Chats
        </div>
        <Menu
          mode="vertical"
          theme="dark"
          selectedKeys={[selectedMenu]}
          onClick={handleMenuSelect}
          className="border-r border-gray-700"
        >
          <Menu.Item key="mentions" className="text-lg">
            <div className="">
              <span>Mentions</span>
             {hasUnreadMentions && <Badge dot />}
            </div>
          </Menu.Item>
          {groups?.map((grp) => {
            return (
              <Menu.Item key={grp._id} className="text-lg">
                {grp.title}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      {selectedMenu !== "mentions" && (
        <Chat selectedGroup={selectedMenu} setSelectedMenu={setSelectedMenu} />
      )}
      {selectedMenu === "mentions" && <Mentions setHasUnreadMentions={setHasUnreadMentions} />}
    </Layout>
  );
};

export default Sidebar;
