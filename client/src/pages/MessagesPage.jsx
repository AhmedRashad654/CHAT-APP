import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../componants/Avatar";
import { FaAngleLeft } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuPlus } from "react-icons/lu";
import { IoSendSharp } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import Loading from "../componants/Loading";
import moment from "moment";
import one from "../assets/wallapaper.jpeg";
export default function MessagesPage() {
  const navigate = useNavigate();
  const [openImageVideo, setOpenImageVideo] = useState(false);
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState();
  const [allMessage, setAllMessages] = useState([]);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state.user);
  //////////////////////////////
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  /////////////////////////////
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("userId", userId);

      socketConnection.on("inform-user", (data) => {
        setUserDetails(data);
      });

      socketConnection.on("all-message", (data) => {
        console.log(data);
        setAllMessages(data);
      });
      /////////////start previeous message////////////
      socketConnection.emit("previous-message", userId);
      /////////////end previeous message////////////
    }

    return () => {
      if (socketConnection) {
        socketConnection.off("inform-user");
        socketConnection.off("all-message");
      }
    };
  }, [socketConnection, userId, user]);
  ///////////upload image////////////

  const [loading, setLoading] = useState(false);
  async function handleUploadImage(e) {
    setLoading(true);
    const response = await uploadImage(e.target.files[0]);
    setLoading(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: response.url,
      };
    });
  }

  /////////upload image/////////
  ///////////upload video//////
  async function handleUploadVideo(e) {
    setLoading(true);
    const response = await uploadImage(e.target.files[0]);
    setLoading(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: response.url,
      };
    });
  }

  /////////upload image/////////
  ////////////////////////////
  const currentMessage = useRef(null);
  useEffect(() => {
    if (currentMessage.current && socketConnection) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage, socketConnection, user, userId]);

  ////////////////
  /////////handleSumbit////////
  function handleSubmit() {
    if (socketConnection) {
      if (message.text || message.imageUrl || message.videoUrl) {
        const newMessage = {
          sender: user?._id.toString(),
          reciver: userId.toString(),
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUser: user?._id,
        };
        socketConnection.emit("new-message", newMessage);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
        setOpenImageVideo(false);
      }
    }
  }

  ///////handlesubmit/////////
  return (
    <div className="h-screen">
      <div className="bg-white sticky top-0 h-16 w-full py-2 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <div className="block lg:hidden">
            <FaAngleLeft
              className="mb-3 text-slate-400 cursor-pointer"
              size={22}
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex justify-start">
              <Avatar
                width={45}
                name={userDetails?.name}
                imgUrl={userDetails?.profile_pic}
                userId={userId}
              />
            </div>
            <div className="mb-3 -space-y-1">
              <p>{userDetails?.name}</p>
              <p className="text-primary text-sm">
                {userDetails?.online ? "online" : "offline"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <BsThreeDotsVertical className="cursor-pointer" />
        </div>
      </div>
      <div
        className="h-[calc(100%-113px)] w-full flex items-center justify-center bg-no-repeat bg-cover  relative"
        style={{ backgroundImage: `url(${one})` }}
      >
        {/* /////////////start display message/////////////// */}
        <div className="w-full z-20 px-4 absolute bottom-5 overflow-y-scroll scrollbar h-[calc(100%-25px)]">
          {allMessage.length > 0 &&
            allMessage.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  user?._id === msg?.msgByUser ? "justify-end" : "justify-start"
                }`}
                ref={currentMessage}
              >
                {msg?.text && (
                  <p
                    className={` w-fit py-1 px-2 my-2 rounded-md -space-y-0${
                      user?._id === msg?.msgByUser
                        ? " bg-lime-200"
                        : " bg-blue-100"
                    }`}
                  >
                    {msg?.text}
                    <br />
                    <small className="text-[10px] mb-5  flex justify-end">
                      {moment(msg.updatedAt).format("MM/DD/YYYY")}
                    </small>
                  </p>
                )}
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    alt="from db"
                    className="w-[250px]"
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg?.videoUrl}
                    muted
                    controls
                    className="w-[250px]"
                  ></video>
                )}
              </div>
            ))}
        </div>
        {/* /////////////end display message/////////////// */}
        <div className="fixed z-40">
          {loading && <Loading />}
          {message.imageUrl && (
            <div className="w-full max-w-md h-[60%]">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="w-full h-full"
              />
            </div>
          )}
          {message.videoUrl && (
            <div className="w-full max-w-md  h-[60%]">
              <video
                src={message.videoUrl}
                className="w-full h-full aspect-video"
                muted
                controls
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-12 bg-white flex items-center justify-between p-4">
        <div className="relative z-20">
          <LuPlus
            size={40}
            className="hover:bg-primary cursor-pointer rounded-full p-2"
            onClick={() => setOpenImageVideo((e) => !e)}
          />
          {openImageVideo && (
            <div className="absolute bottom-[44px] bg-white p-1">
              <label
                htmlFor="image"
                className="flex gap-2 items-center p-2 text-sm hover:bg-slate-200 cursor-pointer"
              >
                <FaRegImage />
                image
              </label>
              <label
                htmlFor="video"
                className="flex gap-2 items-center p-2 text-sm hover:bg-slate-200 cursor-pointer"
              >
                <FaVideo />
                video
              </label>
              <input
                type="file"
                id="image"
                onChange={handleUploadImage}
                className="hidden"
              />
              <input
                type="file"
                id="video"
                onChange={handleUploadVideo}
                className="hidden"
              />
            </div>
          )}
        </div>
        <div className="flex items-center  w-full h-12 justify-between">
          <input
            type="text"
            className="w-full h-full outline-none px-2 text-sm"
            placeholder="Type message here..."
            value={message?.text}
            onChange={(e) => {
              setMessage((prev) => {
                return {
                  ...prev,
                  text: e.target.value,
                };
              });
            }}
          />
          <IoSendSharp
            className="cursor-pointer text-primary hover:text-black"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
