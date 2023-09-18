import React, { useState } from "react";
import { Layout, Menu } from "antd";
import Chat from "./Chat";
import useUser from "@/app/hooks/useUser";

const { Sider } = Layout;

const Sidebar = () => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const { user } = useUser();

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
          {groups?.map((grp) => {
            return (
              <Menu.Item key={grp._id} className="text-lg">
                {grp.title}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
        <Chat selectedGroup={selectedMenu} setSelectedMenu={setSelectedMenu} />

    </Layout>
  );
};

export default Sidebar;
