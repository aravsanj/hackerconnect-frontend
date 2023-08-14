import { useState } from "react";
import { Button, Modal } from "antd";
import EditButton from "./Utils/EditButton";
import { Form, Input } from "antd";
import axios from "axios";
import useProfile from "../hooks/useProfile";
import { BASE_URL } from "../../config";

type Props = {
  about: string | undefined;
};

const UpdateAboutModal = ({ about }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refetch } = useProfile();

  const showModal = () => {
    setOpen(true);
  };

  async function updateAbout(value: {
    about: string
  }) {
    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/user/updateUser`,
        {
          about: value.about,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      refetch();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  const onFinish = (value: {
    about: string
  }) => {
    updateAbout(value);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <EditButton onClick={showModal} />

      <Modal
        open={open}
        title="About"
        onCancel={handleCancel}
        width={700}
        footer={null}
      >
        <Form onFinish={onFinish}>
          <Form.Item initialValue={about} name="about">
            <Input.TextArea rows={10} cols={10} />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateAboutModal;
