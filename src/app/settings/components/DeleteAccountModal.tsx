import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

const DeleteAccountModal = ({ open, onCancel, onDelete, username }: any) => {
  const [usernameConfirm, setUsernameConfirm] = useState("");

  const handleUsernameChange = (e: any) => {
    const enteredUsername = e.target.value;
    setUsernameConfirm(enteredUsername);
  };

  return (
    <Modal
      title="Delete Account"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={onDelete}
          disabled={!(usernameConfirm === username)}
        >
          Delete
        </Button>,
      ]}
    >
      <p>
        This action is not reversible. Please type your username to confirm the
        deletion.
      </p>
      <Input
        placeholder="Type your username"
        className="!mt-4"
        value={usernameConfirm}
        onChange={handleUsernameChange}
      />
    </Modal>
  );
};

export default DeleteAccountModal;
