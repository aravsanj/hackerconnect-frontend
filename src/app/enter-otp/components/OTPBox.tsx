import { Form, Input, Button } from "antd";

type Props = {
  verifyOTP: (values: { otp: string }) => void;
};

const OTPBox = ({ verifyOTP }: Props) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl mb-4 text-center font-semibold text-gray-800">
        Enter OTP
      </h1>
      <Form onFinish={verifyOTP}>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please enter your OTP!" },
            {
              pattern: /^[0-9]{6}$/,
              message: "Please enter a 6-digit OTP!",
            },
          ]}
        >
          <Input
            type="text"
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full py-2 px-3 rounded border outline-none focus:ring focus:ring-indigo-500"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded"
          >
            Verify OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OTPBox;
