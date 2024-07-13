import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../componants/Avatar";
import axios from "axios";
import uploadImage from "../helpers/uploadImage";
import { setUser } from "../redux/slice/userSlice";
import { toast } from "react-toastify";

export default function UpdateUser({ onClose }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [dataName, setDataName] = useState(user.name);
  const [uploadImg, setUploadImage] = useState();
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  async function handleChangeImage(e) {
    setLoadingImg(true);
    const upload = await uploadImage(e.target.files[0]);
    setUploadImage(upload?.url);
    setLoadingImg(false);
  }
  async function handleSubmit() {
    setLoadingUpdate(true);
    const response = await axios.post(
      "http://localhost:8000/api/updateUser",
      {
        name: dataName,
        profile_pic: uploadImg,
      },
      {
        withCredentials: true,
      }
    );
    setLoadingUpdate(false);
    if (response?.data?.message === "updated succesfully") {
      dispatch(setUser(response?.data?.data));
      toast.success(response?.data?.message);
      onClose();
    }
  }
  return (
    <div className="fixed top-0 left-0 bg-stone-700 w-full h-screen bg-opacity-50 flex justify-center items-center z-30">
      <div className="w-full sm:max-w-md bg-white p-5 flex justify-center flex-col gap-2">
        <h3 className="font-semibold">Details Profile</h3>
        <p className="text-sm">Update Profile</p>
        <div className="flex flex-col gap-2 ">
          <label htmlFor="name">Name : </label>
          <input
            type="text"
            className="border rounded-md outline-none px-2  "
            value={dataName}
            onChange={(e) => setDataName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 justify-start">
          <p>photo : </p>
          <div>
            <label
              htmlFor="photo"
              className="flex justify-start cursor-pointer items-center gap-2"
            >
              <Avatar name={user.name} imgUrl={user.profile_pic} width={40} />
              <p className="font-semibold mb-4">
                {loadingImg ? "Loading..." : "change photo"}
              </p>
            </label>
          </div>
          <input
            type="file"
            id="photo"
            className="hidden"
            onChange={handleChangeImage}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="px-4  border border-primary mr-1 py-[1px]"
            onClick={onClose}
          >
            cancel
          </button>
          <button
            className="px-4  bg-primary  border border-primary text-white  py-[1px]"
            onClick={handleSubmit}
            disabled={loadingImg}
          >
            {loadingUpdate ? "Loading..." : " save"}
          </button>
        </div>
      </div>
    </div>
  );
}
