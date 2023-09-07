import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

const OTPModal = ({ visible, onOTPSubmit }: any) => {
  const [otp, setOTP] = useState("");

  const handleOTPChange = (e: any) => {
    const enteredOTP = e.target.value;
    if (enteredOTP.match(/^\d*$/) && enteredOTP.length <= 6) {
      setOTP(enteredOTP);
    }
  };

  const handleSubmit = () => {
    onOTPSubmit(otp);
    setOTP("");
  };

  return (
    <Modal
      title="Enter OTP (Check your phone)"
      open={visible}
      maskClosable={false}
      closeIcon={null}
      keyboard={false}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={otp.length < 6}
        >
          Submit
        </Button>,
      ]}
    >
      <Input
        value={otp}
        onChange={handleOTPChange}
        maxLength={6}
        placeholder="Enter OTP"
      />
    </Modal>
  );
};

export default OTPModal;
