"use client";

import { Col, Row, Card } from "antd";
import NewPasswordForm from "./components/NewPasswordForm";


export default function Page() {
  return (

      <Row className="h-[100vh] bg-[#1DA1F2]" justify="center">
        <Col>
          <Card className="relative top-48 left-[50%] -translate-x-[50%] max-w-[400px]">
            <NewPasswordForm />
          </Card>
        </Col>
      </Row>

  );
}
