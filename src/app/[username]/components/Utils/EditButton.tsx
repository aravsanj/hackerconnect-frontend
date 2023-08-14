import React from "react";
import { GrEdit } from "react-icons/gr";

type Props = {
  onClick?: () => void;
};

const EditButton = ({ onClick }: Props) => {
  return <GrEdit className="cursor-pointer" onClick={onClick} />;
};

export default EditButton;
