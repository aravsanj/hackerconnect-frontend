import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import Image from "next/image";
import { BASE_URL } from "@/app/config";
import axios from "axios";
import useUser from "@/app/hooks/useUser";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const imageTypes = ["image/jpeg", "image/png", "image/gif"];

const beforeUpload = (file: { type: string }) => {
  const isValidType = imageTypes.includes(file.type);
  if (!isValidType) {
    message.error("You can only upload image files!");
  }
  return isValidType ? true : Upload.LIST_IGNORE;
};

type Props = {
  setImageURLs: React.Dispatch<React.SetStateAction<string[]>>;
};

const ImageUpload = ({ setImageURLs }: Props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { user } = useUser();
  const _id = user?._id;

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        beforeUpload={beforeUpload}
        listType="picture-card"
        customRequest={async ({ file, onSuccess }) => {
          try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("_id", _id as string);

            const response = await axios.post(
              `${BASE_URL}/post/uploadImage`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            );

            setImageURLs((prev) => [...prev, response.data.imageUrl]);
            // @ts-ignore
            onSuccess("ok");
          } catch (error) {
            console.error(error);
          }
        }}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 3 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image alt="example" fill src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;
