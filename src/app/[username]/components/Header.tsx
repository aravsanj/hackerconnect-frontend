import CoverPhoto from "./Utils/CoverPhoto";
import Avatar from "./Utils/Avatar";
import Meta from "./Utils/Meta";
import UpdateModal from "./UpdateUserModal";
import { profile } from "../contexts/profileContext";
import useUser from "../../hooks/useUser";
import ConnectButton from "./Utils/ConnectButton";

const Header = ({ profile }: { profile: profile | undefined }) => {
  const { user } = useUser();
  const isLoggedIn = user?.isLoggedIn;
  const sameUser = user?._id === profile?._id;

  return (
    <div className="flex flex-col mt-16 h-[400px] rounded-xl bg-[#fff] relative">
      <CoverPhoto url={profile?.cover} />
      <div className="flex flex-col p-4 ml-6 -mt-20">
        <Avatar url={profile?.profile} />
        <Meta profile={profile} />
      </div>

      {isLoggedIn && sameUser && (
        <div className="self-end pr-12">
          <UpdateModal profile={profile} />
        </div>
      )}

      {isLoggedIn && !sameUser && <ConnectButton />}
    </div>
  );
};

export default Header;
