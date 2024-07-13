import React from "react";
import { FiArrowUpLeft } from "react-icons/fi";

export default function ExploreUser({ setSearched }) {
  return (
    <div
      className="flex flex-col gap-3 items-center  mt-10 text-slate-500 cursor-pointer"
      onClick={() => setSearched(true)}
    >
      <FiArrowUpLeft size={40} />
      <div className="text-center text-md">
        Explore users to start a conversation with
      </div>
    </div>
  );
}
