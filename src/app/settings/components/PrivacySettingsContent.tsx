import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import { Button, Card, Layout, Popconfirm } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

const { Content } = Layout;

type Props = {};

const PrivacySettingsContent = (props: Props) => {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const userId = user?._id;
  const username = user?.username
  const router = useRouter();

  const onDeactivate = async (userId: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/deactivate`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(null);
      router.push("/");
    } catch (e: any) {
      console.error(e);
    }
  };

  const onDelete = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/delete`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setUser(null);
      router.push("/");
    } catch (e: any) {
      console.error(e);
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  return (
    <Content className="mt-10" style={{ padding: "0 50px", minHeight: 280 }}>
      <DeleteAccountModal
        open={open}
        onCancel={onCancel}
        onDelete={onDelete}
        username={username}
      />
      <div className="mx-auto">
        <Card title="Account Actions">
          <div className="mb-4 flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">Deactivate Account</h2>
            <p className="text-gray-600">
              Deactivate your account temporarily.
            </p>
            <Popconfirm
              title="Deactivate Account"
              description={
                <>
                  <p>Are you certain you wish to deactivate your account?</p>
                  <p>
                    You retain the option to reactivate it at any time by simply
                    logging back in.
                  </p>
                </>
              }
              onConfirm={() => onDeactivate(userId as string)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="default" danger className="w-[200px]">
                Deactivate
              </Button>
            </Popconfirm>
          </div>
          <div className="mt-16 flex flex-col gap-y-2">
            <h2 className="text-xl font-semibold">Delete Account</h2>
            <p className="text-gray-600">Permanently delete your account.</p>
            <Button
              type="default"
              danger
              className="w-[200px]"
              onClick={() => onOpen()}
            >
              Delete
            </Button>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default PrivacySettingsContent;
