"use client";
import SettingsPage from "./components/Settings";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <SettingsPage />
    </div>
  );
};

export default page;
