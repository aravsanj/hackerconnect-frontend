import React from "react";

type Props = {
    email: string;
}

const EmailSentCard = ({ email }: Props) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md shadow-md">
      <p className="font-semibold">
        Email sent to: <span className="text-green-600">{email}</span>
      </p>
      <p className="text-sm">
        Please check your email for the verification link. If you didn't receive
        the email, please check your spam folder. <br /> You can login once you've clicked the confirmation link.
      </p>
    </div>
  );
};

export default EmailSentCard;
