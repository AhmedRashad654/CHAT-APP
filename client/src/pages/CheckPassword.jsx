import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../componants/Avatar";
import { useDispatch} from "react-redux";
import { setToken } from "../redux/slice/userSlice";

export default function CheckPassword() {
 
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (!location?.state?.data?.data) {
      navigate("/checkemail");
    }
  }, [location, navigate]);
  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/password",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.data.message === "success login") {
        dispatch(setToken(response?.data));
        localStorage.setItem("token", response?.data?.token);
        toast.success(response?.data?.message);
        reset();
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  }

  return (
    <div className="mt-5 bg-white max-w-md mx-auto p-5">
      <div>
        <Avatar
          width={70}
          name={location?.state?.data?.data?.name}
          imgUrl={location?.state?.data?.data?.profile_pic}
        />
        <h1>Welcome To Chat App !</h1>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1  mb-3">
            <label htmlFor="email">password : </label>
            <input
              type="password"
              name="password"
              className="bg-slate-100 p-1 outline-none border rounded-md focus:border-primary"
              id="password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 6,
                  message: "password must be leatest on 6 characters",
                },
              })}
              placeholder="password"
            />
            {errors.password && (
              <small className="text-red-300">{errors.password.message}</small>
            )}
          </div>
          <input
            type="hidden"
            {...register("userId")}
            value={location?.state?.data?.data?._id}
          />
          <button className="bg-primary w-full mt-5 p-1  text-white font-bold rounded-md">
            {isSubmitting ? "Loading..." : "Let's Go"}
          </button>
          <div className="flex mt-3 justify-center gap-1">
            <p
              className="text-primary font-bold cursor-pointer"
              onClick={() => navigate("/forgetpassword")}
            >
              Forget Password
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
