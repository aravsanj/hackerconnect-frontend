import { useState } from "react";
import { Layout, Menu } from "antd";
import UpdateForm from "./UpdateForm";
import useUser from "@/app/hooks/useUser";
import PrivacySettingsContent from "./PrivacySettingsContent";
import BlockedUserSettings from "./BlockedUserSettings";

const { Content, Sider } = Layout;

const GeneralSettings = (
  <Content className="mt-10" style={{ padding: "0 50px", minHeight: 280 }}>
    <div className="mt-6">
      <UpdateForm />
    </div>
  </Content>
);

const PrivacySettings = (
  <PrivacySettingsContent />
);

const BlockedUserSettingsContent = (
  <BlockedUserSettings />
);

const SettingsPage = () => {
  const { user } = useUser();

  const userId = user?._id;

  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  const handleMenuSelect = (item: any) => {
    setSelectedMenuItem(item.key);
  };

  let contentToDisplay;

  switch (selectedMenuItem) {
    case "1":
      contentToDisplay = GeneralSettings;
      break;
    case "2":
      contentToDisplay = PrivacySettings;
      break;
    case "3":
      contentToDisplay = BlockedUserSettingsContent;
      break;
    default:
      contentToDisplay = GeneralSettings; 
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <Menu
          mode="vertical"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedMenuItem]}
          onSelect={handleMenuSelect}
        >
          <Menu.Item key="1">General Settings</Menu.Item>
          <Menu.Item key="3">Manage Blocked Users</Menu.Item>
          <Menu.Item key="2">Account Settings</Menu.Item>

        </Menu>
      </Sider>
      <Layout className="site-layout">{contentToDisplay}</Layout>
    </Layout>
  );
};

export default SettingsPage;
