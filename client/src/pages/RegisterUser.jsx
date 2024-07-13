import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import uploadImage from "../helpers/uploadImage";
import { useNavigate } from "react-router-dom";
export default function RegisterUser() {
  const [image, setImage] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageCloudniry, setImgCloudniry] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function handleChangeImage(e) {
    setLoadingImage(true);
    const file = e.target.files[0];
    setImage(e.target.files[0]);
    const upload = await uploadImage(file);
    setLoadingImage(false);
    setImgCloudniry(upload.url);
  }

  async function onSubmit(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profile_pic", imageCloudniry.toString());

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        formData
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        reset();
        setImage("");
        navigate("/checkemail");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="mt-5 bg-white max-w-md mx-auto p-5">
      <div>
        <h1>Welcome To Chat App !</h1>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              name="name"
              className="bg-slate-100 p-1 outline-none border rounded-md focus:border-primary"
              id="name"
              {...register("name", { required: "name is required" })}
              placeholder="name"
            />
            {errors.name && (
              <small className="text-red-300">{errors.name.message}</small>
            )}
          </div>
          <div className="flex flex-col gap-1  mb-3">
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              name="email"
              className="bg-slate-100 p-1 outline-none border rounded-md focus:border-primary"
              id="email"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="email"
            />
            {errors.email && (
              <small className="text-red-300">{errors.email.message}</small>
            )}
          </div>
          <div className="flex flex-col gap-1  mb-3">
            <label htmlFor="password">password : </label>
            <input
              type="password"
              name="password"
              className="bg-slate-100 p-1 outline-none border rounded-md focus:border-primary"
              id="password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 6,
                  message: "password must be at least 6 characts long",
                },
              })}
              placeholder="password"
            />
            {errors.password && (
              <small className="text-red-300">{errors.password.message}</small>
            )}
          </div>
          <div className="flex flex-col gap-1  mb-3">
            <p>profile_pic : </p>
            <label
              htmlFor="profile_pic"
              className=" flex  items-center gap-2  w-full bg-slate-100 p-3  justify-center   cursor-pointer border hover:border-primary "
            >
              {loadingImage ? (
                "Loading..."
              ) : (
                <p className="line-clamp-1">
                  {image ? image?.name : "upload photo"}
                </p>
              )}

              {image?.name && !loadingImage && (
                <IoClose
                  className="hover:text-red-500 mt-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setImage("");
                  }}
                />
              )}
            </label>

            <input
              type="file"
              name="profile_pic"
              className="bg-slate-100 p-1 outline-none border rounded-md focus:border-primary hidden"
              id="profile_pic"
              {...register("profile_pic")}
              placeholder="profile_pic"
              onChange={handleChangeImage}
            />
          </div>
          <button
            className="bg-primary w-full mt-5 p-1  text-white font-bold rounded-md"
            disabled={loadingImage}
          >
            {isSubmitting ? "Loading..." : "Register"}
          </button>
          <div className="flex mt-3 justify-center gap-1">
            Already have account ?
            <p
              className="text-primary font-bold cursor-pointer"
              onClick={() => navigate("/checkemail")}
            >
              {" "}
              Login{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
