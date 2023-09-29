import React from "react";

import dynamic from "next/dynamic";

const JoinLive = dynamic(() => import("./components/JoinLive"), {
  ssr: false,
});

type Props = {};

const page = (props: Props) => {
  return <JoinLive />;
};

export default page;
