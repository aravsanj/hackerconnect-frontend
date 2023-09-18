"use client";

import dynamic from "next/dynamic";

const LiveStream = dynamic(() => import("./components/LiveStream"), {
  ssr: false,
});

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <LiveStream />
    </div>
  );
};

export default Page;
