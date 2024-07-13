import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import UpdateUser from "../pages/UpdateUser";
import { setLogout } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import Divider from "./Divider";
import ExploreUser from "./ExploreUser";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
export default function Sidebars() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateUser, setUpdateUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [searched, setSearched] = useState(false);
  const socketConnection = useSelector((state) => state.user.socketConnection);

  async function handleLogOut() {
    dispatch(setLogout());
    localStorage.clear();
    navigate("/checkemail");
  }
  // {////////socket.io//////////////////}
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit( "sidebar", user?._id );
      

    
      socketConnection.on( "messageSlider", ( data ) => {
       
        const Detailses = data.map( ( e) => {
          if ( e?.sender?._id === e?.reciver?._id ) {
            return {
              ...e,
              userDetails:e.sender
            }
          } else if ( e?.reciver?._id !== user?._id ) {
            return {
              ...e,
              userDetails:e?.reciver
            }
          } else {
            return {
              ...e,
              userDetails:e?.sender
            }
          }
      } )
        setAllUser(Detailses);
      });
    }
    /////////////////

    return () => {
      if (socketConnection) {
        socketConnection.off("messageSlider");
      }
    };
    ////////////
  }, [socketConnection, user,allUser]);
  // {////////socket.io//////////////////}

  return (
    <div className="bg-white w-full h-screen grid grid-cols-[48px,1fr] pt-[1px]">
      <div className="w-12 h-screen bg-slate-100 rounded-tr-lg rounded-br-lg pt-5 pb-5 flex flex-col justify-between">
        <div className="w-full flex justify-center items-center flex-col ">
          <div
            className="w-full hover:bg-slate-300 flex justify-center px-2 py-3 cursor-pointer"
            title="chat"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </div>
          <div
            className="w-full hover:bg-slate-300 flex justify-center px-2 py-3 cursor-pointer"
            title="Add Friend"
            onClick={() => setSearched(true)}
          >
            <IoIosPersonAdd size={20} />
          </div>
        </div>
        <div className="w-full flex justify-center items-center flex-col">
          <div
            className="w-full  flex justify-center p-2 cursor-pointer"
            title="profile"
            onClick={() => setUpdateUser(true)}
          >
            <Avatar
              width={35}
              name={user.name}
              imgUrl={user.profile_pic}
              userId={user?._id}
            />
          </div>
          <div
            className="w-full hover:bg-slate-300 flex justify-center px-2 py-3 cursor-pointer"
            title="logout"
            onClick={handleLogOut}
          >
            <CiLogout size={20} />
          </div>
          {searched && (
            <IoMdClose
              className="absolute top-5 right-10 z-40 hover:text-primary cursor-pointer"
              size={30}
              onClick={() => setSearched(false)}
            />
          )}
        </div>
      </div>
      <div className="w-full h-screen">
        <div className="flex justify-center items-center h-16 text-xl font-semibold">
          Message
        </div>
        <Divider />
        {allUser.length < 1 && <ExploreUser setSearched={setSearched} />}
        {allUser?.length > 0 && (
          <div
            className="overflow-y-auto scrollbar p-1"
            style={{ height: "calc(100% - 70px)" }}
          >
            {/* //////////////map////////////// */}
            {allUser.map((e, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-2 mb=[2px] hover:border hover:border-primary cursor-pointer"
                onClick={() => navigate(`/${e?.userDetails?._id}`)}
              >
                <div className="flex gap-3 items-center ">
                  <div className="mt-3">
                    <Avatar
                      width={45}
                      imgUrl={e?.userDetails?.profile_pic}
                      name={e?.userDetails?.name}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{e?.userDetails?.name}</p>
                    <p className="text-sm text-slate-400 line-clamp-1 text-ellipsis">
                      {e?.lastmessage?.text ? (
                        e?.lastmessage?.text.toString().slice(0, 10)
                      ) : e?.lastmessage?.imageUrl ? (
                        <div className="flex gap-1 items-center">
                          <FaImage />
                          <p className="mb-[2px]">Image</p>
                        </div>
                      ) : e?.lastmessage?.videoUrl ? (
                        <div className="flex gap-1 items-center">
                          <FaVideo />
                          <p className="mb-[2px]">video</p>
                        </div>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
                <div className=" bg-primary px-3 py-1 rounded-full text-white font-semibold text-sm">
                  {e?.countUnSeenMessage}
                </div>
              </div>
            ))}

            {/* //////////////map////////////// */}
          </div>
        )}
      </div>
      {searched && <SearchUser setSearched={setSearched} />}
      {updateUser && <UpdateUser onClose={() => setUpdateUser(false)} />}
    </div>
  );
}
