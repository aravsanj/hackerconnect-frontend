"use client";

import { useState } from "react";
import { Alert, Button, Spin, message } from "antd";
import axios from "axios";
import { BASE_URL } from "../config";
import useAuth from "../hooks/useAuth";
import OTPBox from "./components/OTPBox";
import EmailSentCard from "./components/EmailCard";
import { useRouter } from "next/navigation";

const OtpPage = () => {
  const {
    email,
    phone,
    isPhoneVerified,
    isEmailVerified,
    isRedirectedFromLogin,
    isRedirectedFromRegister
  } = useAuth();
  const [OtpVerified, setOtpVerified] = useState(false);
  const [OTPsend, setOTPSend] = useState(false);
  const [emailSend, setEmailSend] = useState(false);

  const router = useRouter()

  const verifyOTP = async (values: { otp: string }) => {
    try {
      const payload = {
        phone: phone,
        email: email,
        enteredOTP: values.otp,
      };

      const response = await axios.post(`${BASE_URL}/auth/verifyOTP`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setOtpVerified(true);
    } catch (e: any) {
      message.warning("OTP validation failed, try again");
      console.error(e);
    }
  };

  const sendOTP = async () => {
    try {
      const payload = {
        phone: phone,
      };

      const response = await axios.post(`${BASE_URL}/auth/sendOTP`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setOTPSend(true);
    } catch (e: any) {
      console.error(e);
    }
  };

  const sendConfirmLink = async () => {
    try {
      const payload = {
        email: email,
      };

      const response = await axios.post(
        `${BASE_URL}/auth/sendConfirmationLink`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setEmailSend(true);
    } catch (e: any) {
      console.error(e);
    }
  };

  if(!isRedirectedFromRegister && !isRedirectedFromLogin) {
    router.push("/")
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isRedirectedFromLogin) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-indigo-600">
        {!OtpVerified ? (
          <>
            <Alert
              message="OTP sent to your registered mobile. Please enter it below to proceed."
              type="success"
              showIcon
            />
            <div className="mt-10">
              <OTPBox verifyOTP={verifyOTP} />
            </div>
          </>
        ) : (
          <EmailSentCard email={email} />
        )}
      </div>
    );
  }



  if (!isPhoneVerified) {
    if (OtpVerified) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-indigo-600">
          <EmailSentCard email={email} />
        </div>
      );
    }

    if (OTPsend) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-indigo-600">
          <Alert
            message="OTP sent to your registered mobile. Please enter it below to proceed."
            type="success"
            showIcon
          />
          <div className="mt-10">
            <OTPBox verifyOTP={verifyOTP} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-indigo-600">
        <Alert
          message="It appears that your mobile number has not been verified yet. Please
              verify your number to continue."
          type="warning"
          showIcon
        />

        <Button
          onClick={sendOTP}
          className="block w-32 mt-10 mb-10"
          type="default"
        >
          Send OTP
        </Button>
      </div>
    );
  }

  if (emailSend) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-indigo-600">
        <EmailSentCard email={email} />
      </div>
    );
  }

  if (!isEmailVerified) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-blue-400 to-indigo-600">
        <Alert
          message="Your email is pending verification. Please check your inbox for the confirmation link."
          type="warning"
          showIcon
        />

        <Button
          onClick={sendConfirmLink}
          className="block w-32 mt-10 mb-10"
          type="default"
        >
          Resend Email
        </Button>
      </div>
    );
  }

 
};

export default OtpPage;
