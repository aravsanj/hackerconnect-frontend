import React, { useState } from 'react';
import { Modal, Button, Form, Radio, Input } from 'antd';

const ReportForm = ({ open, onCancel, onSubmit }: any) => {
  const [reportReason, setReportReason] = useState('spam');
  const [customResponse, setCustomResponse] = useState('');

  const handleCancel = () => {
    onCancel();
    setReportReason('spam'); // Reset the form
    setCustomResponse('');
  };

  const handleSubmit = () => {
    // You can perform any necessary validation here before submitting the report
    onSubmit({
      reason: reportReason,
      customResponse,
    });
    handleCancel();
  };

  return (
    <Modal
      title="Report Post"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Select a reason for reporting:">
          <Radio.Group onChange={(e) => setReportReason(e.target.value)} value={reportReason}>
            <Radio value="spam">Spam</Radio>
            <Radio value="harassment">Harassment</Radio>
            <Radio value="hate_speech">Hate Speech</Radio>
            <Radio value="other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        {reportReason === 'other' && (
          <Form.Item label="Custom Response">
            <Input.TextArea
              rows={4}
              placeholder="Enter your custom response..."
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ReportForm;
