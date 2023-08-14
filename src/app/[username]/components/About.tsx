import { Typography } from "antd";
import UpdateAboutModal from "./UpdateAboutModal";
import { Skeleton } from "antd";
import useUser from "../../hooks/useUser";

type Props = {
  about: string | undefined;
};

const About = ({ about }: Props) => {
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;

  return (
    <div className="flex flex-col mt-8 p-10 rounded-xl bg-[#E1E8ED] relative">
      <Typography.Title level={4} className="mb-0 pb-0">
        About
      </Typography.Title>
      <Skeleton
        title={false}
        loading={!about}
        active={true}
        paragraph={{ rows: 5 }}
      >
        <Typography.Paragraph>{about}</Typography.Paragraph>
      </Skeleton>

      {isLoggedIn && (
        <div className="self-end p-2">
          <UpdateAboutModal about={about} />
        </div>
      )}
    </div>
  );
};

export default About;
