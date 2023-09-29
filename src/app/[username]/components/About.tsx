import { Typography } from "antd";
import UpdateAboutModal from "./UpdateAboutModal";
import { Skeleton } from "antd";
import useUser from "../../hooks/useUser";
import { profile } from "../contexts/profileContext";
import useProfile from "../hooks/useProfile";

const About = ({ profile }: { profile: profile | undefined }) => {
  const about = profile?.about;
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;
  const sameUser = user?._id === profile?._id;
  const { hasReceivedFirstResponse } = useProfile();

  return (
    <div className="flex flex-col mt-8 p-10 rounded-xl bg-[#fff] relative">
      <Typography.Title level={4} className="mb-0 pb-0">
        About
      </Typography.Title>
      <Skeleton
        title={false}
        loading={!about && !hasReceivedFirstResponse}
        active={true}
        paragraph={{ rows: 5 }}
      >
        {about ? (
          <Typography.Paragraph className="text-gray-600">
            {about}
          </Typography.Paragraph>
        ) : sameUser ? (
          <p className="text-gray-600">
            Enhance your profile by adding more details about yourself. Share
            your interests, experiences, and more to connect better with others.
          </p>
        ) : (
          ""
        )}
      </Skeleton>

      {isLoggedIn && sameUser && (
        <div className="self-end p-2">
          <UpdateAboutModal about={about} />
        </div>
      )}
    </div>
  );
};

export default About;
