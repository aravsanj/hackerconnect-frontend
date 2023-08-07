import { Button, Checkbox, DatePicker, Form, Input } from "antd";

export default function Register() {
  const onFinish = (values: any) => {
    // console.log("Success:", values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="firstName"
        style={{ display: "inline-block", width: "calc(50% - 12px)" }}
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
        name="lastName"
        style={{ display: "inline-block", width: "calc(50% - 12px)" }}
      >
        <Input placeholder="Last name" name="lastName" />
      </Form.Item>
      <Form.Item
        name="dateOfBirth"
        style={{ display: "inline-block", width: "calc(50% - 12px)" }}
      >
        <DatePicker placeholder="DOB" />
      </Form.Item>
      <span
        style={{
          display: "inline-block",
          width: "24px",
        }}
      ></span>
      <Form.Item
        name="lastName"
        style={{ display: "inline-block", width: "calc(50% - 12px)" }}
      >
        <Input placeholder="Phone" name="phone" />
      </Form.Item>
      <Form.Item name="email">
        <Input placeholder="Email" name="email" />
      </Form.Item>
      <Form.Item name="username">
        <Input placeholder="Username" name="username" />
      </Form.Item>

      <Form.Item
        name="password"
        style={{ display: "inline-block", width: "calc(50% - 12px)" }}
      >
        <Input.Password placeholder="password" name="password" />
      </Form.Item>
      <span
        style={{
          display: "inline-block",
          width: "24px",
        }}
      ></span>
      <Form.Item
        name="confirmPassword"
        style={{ display: "inline-block", width: "calc(50% - 12px)" }}
      >
        <Input.Password placeholder="Confirm password" name="confirmPassword" />
      </Form.Item>

      <Form.Item name="agree" valuePropName="checked">
        <Checkbox name="agree">I agree to the terms and conditions</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button className="w-full" type="primary" htmlType="submit">
          Sign up
        </Button>
      </Form.Item>
    </Form>
  );
}
