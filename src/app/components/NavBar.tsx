import { Layout, Input, Avatar, Dropdown, MenuProps, Button } from "antd";
import { PiMetaLogoBold } from "react-icons/pi";
import { AiFillHome } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IconContext } from "react-icons";
import useUser from "../hooks/useUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "../config";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const NavBar = () => {
  const { user, refetch } = useUser();
  const profile = user?.profile;
  const username = user?.username;
  const isLoggedIn = user?.isLoggedIn;

  const router = useRouter();

  async function logout() {
    try {
      console.log("called logout");
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
      console.error("Logout failed:", error);
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
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1D9BF0",
          padding: "10px 50px",
          height: "60px",
          gap: "600px",
        }}
      >
        <div className="flex items-center gap-x-4">
          <PiMetaLogoBold color="white" size="28px" />
          <Input.Search placeholder="Search.." />
        </div>

        {isLoggedIn ? (
          <IconContext.Provider value={{ size: "28px", color: "white" }}>
            <div className="flex gap-x-4">
              <AiFillHome
                className="cursor-pointer"
                onClick={() => router.push("/feed")}
              />
              <IoMdNotifications className="cursor-pointer" />
              <FaUserFriends
                className="cursor-pointer"
                onClick={() => router.push("/network")}
              />
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <Avatar
                  size={26}
                  className="cursor-pointer"
                  src={profile}
                  icon={<UserOutlined />}
                  draggable={false}
                />
              </Dropdown>
            </div>
          </IconContext.Provider>
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
      </Header>
    </Layout>
  );
};

export default NavBar;
