import { Layout, Avatar, Dropdown, Menu, Button, MenuProps } from "antd";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "../config";
import { UserOutlined } from "@ant-design/icons";
import {
  HomeFilled,
  TeamOutlined
} from "@ant-design/icons";
import NotificationPopover from "./NotificationPopover";
import SearchBar from "./SearchBar";

const { Header } = Layout;

const NavBar = () => {
  const { user, refetch } = useUser();
  const profile = user?.profile;
  const username = user?.username;
  const isLoggedIn = user?.isLoggedIn;

  const router = useRouter();

  async function logout() {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      refetch();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);2
    }
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link className="px-4 pr-4" href={`${username}`}>
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link className="px-4 pr-4" href="/settings">
          Settings
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Button danger type="link" onClick={logout} className="px-4 pr-4">
          Log out
        </Button>
      ),
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1D9BF0",
        padding: "10px 20px",
      }}
      className="md:!px-[150px] lg:!px-[200px]"
    >
      <div className="flex items-center gap-x-4">
        <Link href="/feed">
          <span className="cursor-pointer text-2xl leading-none font-black font-mono p-2 bg-indigo-950 rounded-lg text-white font">
            K_
          </span>
        </Link>

        <SearchBar />
      </div>

      <div className="flex gap-x-3">
        {isLoggedIn ? (
          <>
            <HomeFilled
              className="cursor-pointer"
              style={{ color: "white", fontSize: "20px" }}
              onClick={() => router.push("/feed")}
            />
            <TeamOutlined
              className="cursor-pointer"
              style={{ color: "white", fontSize: "20px" }}
              onClick={() => router.push("/network")}
            />

            <NotificationPopover />

            <Dropdown
              overlay={<Menu items={items} />}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Avatar
                size={24}
                className="cursor-pointer"
                src={profile}
                icon={<UserOutlined />}
                draggable={false}
              />
            </Dropdown>
          </>
        ) : (
          <Button
            type="primary"
            onClick={() => router.push("/")}
            icon={<UserOutlined />}
            className="bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-800 border-indigo-600 focus:border-indigo-700"
          >
            Login
          </Button>
        )}
      </div>
    </Header>
  );
};

export default NavBar;
