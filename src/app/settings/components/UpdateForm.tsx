import React, { useState } from "react";
import { Button, Upload, message } from "antd";
import { DatePicker, Form, Input } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import useUser from "../../hooks/useUser";
import { BASE_URL } from "../../config";

type FieldType = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  userUrl: string;
  coverUrl: string;
  title: string;
  phone: string;
  email: string;
  username: string;
};

const UpdateModal = () => {
  const [loading, setLoading] = useState(false);
  const [userUrl, setUserUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const { user, refetch } = useUser();
  const _id = user?._id;

  async function updateUser(value: FieldType) {
    if (userUrl) {
      value = { ...value, userUrl };
    }

    if (coverUrl) {
      value = { ...value, coverUrl };
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/user/updateUser`,
        {
          ...value,
          _id,
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


  const onFinish = (value: FieldType) => {
    updateUser(value);
  };

 
  const imageTypes = ["image/jpeg", "image/png", "image/gif"];

  const beforeUpload = (file: { type: string }) => {
    const isValidType = imageTypes.includes(file.type);
    if (!isValidType) {
      message.error("You can only upload image files!");
    }
    return isValidType ? true : Upload.LIST_IGNORE;
  };

  return (
    <div className="flex justify-center" >
      <Form className="w-[40%]" onFinish={onFinish}>
        <Form.Item
          label="Name"
          labelCol={{ span: 24 }}
          required={true}
          className="!m-0"
        >
          <Form.Item
            initialValue={user?.firstName}
            name="firstName"
            style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            rules={[
              { required: true, message: "Please input your first name!" },
              {
                whitespace: true,
              },
              {
                min: 3,
              },
            ]}
            hasFeedback={true}
          >
            <Input placeholder="First name" name="firstName" />
          </Form.Item>
          <span
            style={{
              display: "inline-block",
              width: "24px",
            }}
          ></span>
          <Form.Item
            initialValue={user?.lastName}
            name="lastName"
            style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            rules={[
              { required: true, message: "Please input your last name!" },
              {
                whitespace: true,
              },
              {
                min: 3,
              },
            ]}
            hasFeedback={true}
          >
            <Input placeholder="Last name" name="lastName" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="title"
          initialValue={user?.title}
          label="Title"
          labelCol={{ span: 24 }}
          hasFeedback={true}
        >
          <Input placeholder="Let the world know who you are" />
        </Form.Item>

        <Form.Item label="Profile picture" labelCol={{ span: 24 }}>
          <Upload
            maxCount={1}
            beforeUpload={beforeUpload}
            customRequest={async ({ file, onSuccess }) => {
              try {
                const formData = new FormData();
                formData.append("user", file);

                formData.append("_id", _id as string);

                const response = await axios.post(
                  `${BASE_URL}/user/uploaduser`,
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                  }
                );

                setUserUrl(response.data.imageUrl);
                // @ts-ignore
                onSuccess("ok");
              } catch (error) {
                console.error(error);
              }
            }}
            onRemove={() => setUserUrl("")}
            listType="picture"
          >
            <Button>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Cover photo" labelCol={{ span: 24 }}>
          <Upload
            maxCount={1}
            customRequest={async ({ file, onSuccess }) => {
              try {
                const formData = new FormData();
                formData.append("cover", file);

                formData.append("_id", _id as string);

                const response = await axios.post(
                  `${BASE_URL}/user/uploadCover`,
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                  }
                );

                setCoverUrl(response.data.imageUrl);
                // @ts-ignore
                onSuccess("ok");
              } catch (error) {
                console.error(error);
              }
            }}
            onRemove={() => setCoverUrl("")}
            listType="picture"
          >
            <Button>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          labelCol={{ span: 24 }}
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          initialValue={dayjs(user?.dateOfBirth, "YYYY-MM-DD")}
          rules={[
            {
              type: "date",
            },
            { required: true, message: "Please input your date of birth!" },

            {
              validator: (_, value) => {
                const birthDate = new Date(value);
                const currentDate = new Date();

                let ageDifference =
                  currentDate.getFullYear() - birthDate.getFullYear();

                if (
                  currentDate.getMonth() < birthDate.getMonth() ||
                  (currentDate.getMonth() === birthDate.getMonth() &&
                    currentDate.getDate() < birthDate.getDate())
                ) {
                  ageDifference--;
                }

                return ageDifference >= 18
                  ? Promise.resolve()
                  : Promise.reject("Must be 18 years old.");
              },
            },
          ]}
          hasFeedback={true}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <span
          style={{
            display: "inline-block",
            width: "24px",
          }}
        ></span>
        <Form.Item
          initialValue={user?.phone}
          name="phone"
          label="Phone no"
          labelCol={{ span: 24 }}
          style={{ display: "inline-block", width: "calc(50% - 12px)" }}
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              type: "string",
            },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Phone" name="phone" />
        </Form.Item>
        <Form.Item
          initialValue={user?.email}
          name="email"
          label="Email"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            { type: "email", message: "Please enter a valid email" },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Email" name="email" />
        </Form.Item>
        <Form.Item
          initialValue={user?.username}
          name="username"
          label="Username"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please enter your username",
            },
            {
              min: 3,
            },
          ]}
          hasFeedback={true}
        >
          <Input placeholder="Username" name="username" />
        </Form.Item>

        <Form.Item>
          <Button
            loading={loading}
            className="w-full"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateModal;
