"use client";
import Sidebar from "./components/Sidebar";
import { StyleProvider } from "@ant-design/cssinjs";

const Page = () => {

  return (
    <StyleProvider hashPriority="high">
      <Sidebar />
    </StyleProvider>
  );
};

export default Page;
