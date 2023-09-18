import React, { useState } from "react";
import { Button, Modal, Steps, Input, Select, Tag, Alert } from "antd";
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import useUser from "@/app/hooks/useUser";
import axios from "axios";
import { BASE_URL } from "@/app/config";

const { Step } = Steps;

const CreateGroupChatButton = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatName, setChatName] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const connections = user?.connections.map((item) => ({
    label: `${item.firstName} ${item.lastName}`,
    value: item._id,
  }));

  const ownerName: string | undefined = `${user?.firstName} ${user?.lastName}`;
  const ownerID: string | undefined = user?._id;

  const participantNames = participants.map((participantId) => {
    const participant = connections?.find(
      (connection) => connection.value === participantId
    );
    return participant ? participant.label : "";
  });

  const adminNames = admins.map((adminId) => {
    const admin = connections?.find(
      (connection) => connection.value === adminId
    );
    return admin ? admin.label : "";
  });

  const openModal = () => {
    setCurrentStep(0);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const createGroup = async () => {
    setLoading(true);
    const participantsNew = [ownerID, ...participants];
    const adminsNew = [ownerID, ...admins];

    const payload = {
      title: chatName,
      participants: participantsNew,
      admins: adminsNew,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/group-chat/initiateGroupChat`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (e: any) {
      console.error(e);
    }
    setLoading(false);
    closeModal();
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChatNameChange = (e: any) => {
    setChatName(e.target.value);
  };

  const handleParticipantChange = (value: any) => {
    setParticipants(value);
  };

  const handleAdminChange = (value: any) => {
    setAdmins(value);
  };

  const steps = [
    {
      title: "Group Chat Name",
      content: (
        <div>
          <Input
            placeholder="Enter chat name"
            value={chatName}
            onChange={handleChatNameChange}
          />
          <Alert
            message="Choose a meaningful title for your group chat!"
            className="!mt-10"
            type="info"
            showIcon
          />
        </div>
      ),
    },
    {
      title: "Participants",
      content: (
        <div>
          <Select
            mode="multiple"
            placeholder="Select participants"
            onChange={handleParticipantChange}
            className="w-full"
            options={connections}
            value={participants}
          ></Select>
          <Alert
            message="To create a group chat, you need at least 2 more participants."
            className="!mt-10"
            type="info"
            showIcon
          />
        </div>
      ),
    },
    {
      title: "Admins",
      content: (
        <div>
          <Select
            mode="multiple"
            placeholder="Select admins"
            onChange={handleAdminChange}
            className="w-full"
            options={connections}
            value={admins}
          ></Select>
          <Alert
            message="By default, the group creator becomes an admin, but you can add more admins if desired!"
            className="!mt-10"
            type="info"
            showIcon
          />
          <Alert
            message="When assigning admin roles, choose people you know and trust."
            className="!mt-10"
            type="warning"
            showIcon
          />
        </div>
      ),
    },
    {
      title: "Confirmation",
      content: (
        <div className="p-4">
          <div className=" border-gray-300 pt-4 flex flex-col gap-y-4">
            <div className="mb-2">
              <p className="text-gray-700 font-medium">Group Chat Name:</p>
              <p className="text-lg">{chatName}</p>
            </div>
            <div className="mb-2">
              <p className="text-gray-700 font-medium">Participants:</p>
              <p className="text-lg">{`You, ${participantNames.join(", ")}`}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Admins:</p>
              <p className="text-lg">
                {adminNames.length === 0
                  ? "You"
                  : `You, ${adminNames.join(", ")}`}
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="bg-blue-500 hover:bg-blue-600 text-white"
        icon={<PlusCircleOutlined />}
        onClick={openModal}
      >
        Start a Group Chat
      </Button>
      <Modal
        onCancel={closeModal}
        open={open}
        footer={null}
        width={900}
        bodyStyle={{ height: "380px" }}
        destroyOnClose
      >
        <div className="py-6 ">
          <Steps current={currentStep}>
            {steps.map((step, index) => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>
          <div className="mt-4">{steps[currentStep].content}</div>
          <div className="mt-4 absolute right-6 bottom-6">
            {currentStep > 0 && (
              <Button className="mr-2" onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                className="mr-2"
                type="primary"
                onClick={handleNextStep}
                disabled={
                  (currentStep === 0 && chatName.trim() === "") || 
                  (currentStep === 1 && participants.length < 2)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                className="mr-2"
                onClick={createGroup}
                icon={<CheckCircleOutlined />}
                loading={loading}
              >
                Finish
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateGroupChatButton;
