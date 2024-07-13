import React from "react";
import { RxAvatar } from "react-icons/rx";
import { useSelector } from "react-redux";
export default function Avatar({ userId, imgUrl, name, width }) {
  const online = useSelector((state) => state.user.onlineUser);

  let nameSplit = name;
  if (name) {
    nameSplit = name.split(" ");
  }

  if (nameSplit?.length > 1) {
    nameSplit = nameSplit[0][0].toUpperCase() + nameSplit[1][0].toUpperCase();
  } else if (nameSplit?.length === 1) {
    nameSplit = nameSplit[0][0].toUpperCase();
  }
  //////online user//////////
  const isOnline = online.includes(userId);
  ///////online user///////
  return (
    <div className="flex flex-col justify-center items-center gap-2 mb-3 relative">
      {imgUrl ? (
        <div className="flex flex-col justify-center items-center gap-1">
          <img
            src={imgUrl}
            alt="imgUrl"
            className=" rounded-full "
            style={{ width: width, height: width }}
          />
        </div>
      ) : name ? (
        <div className="flex flex-col gap-2 justify-center items-center">
          <div
            className={`bg-slate-100 flex items-center justify-center rounded-full text-center font-semibold shadow-md`}
            style={{ width: width, height: width }}
          >
            {nameSplit}
          </div>
        </div>
      ) : (
        <RxAvatar size={width} />
      )}
      {isOnline && (
        <p className="bg-green-500 p-1 rounded-full absolute bottom-1 right-[2px]"></p>
      )}
    </div>
  );
}
