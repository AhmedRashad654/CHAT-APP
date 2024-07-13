import React from "react";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
export default function UserFirst({ user, setSearched }) {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-start items-center gap-2 border p-2 mb-2 hover:border-primary cursor-pointer"
      onClick={() => {
        setSearched(false);
        navigate(`/${user?._id}`);
      }}
    >
      <Avatar
        width={50}
        name={user?.name}
        imgUrl={user?.profile_pic}
        userId={user?._id}
      />
      <div className="mb-3">
        <p className="text-sm line-clamp-1">{user?.name}</p>
        <p className="text-sm line-clamp-1">{user?.email}</p>
      </div>
    </div>
  );
}
