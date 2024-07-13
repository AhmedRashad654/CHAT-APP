import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Avatar from "../componants/Avatar";
export default function CheckEmailUser() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/email",
        data
      );
 
      if (response.data.success) {
        toast.success(response.data.message);
        reset();
        navigate("/checkpassword", {
          state: { data: response.data },
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="mt-5 bg-white max-w-md mx-auto p-5">
      <div>
        <Avatar width={70} />
        <h1>Welcome To Chat App !</h1>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
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

          <button className="bg-primary w-full mt-5 p-1  text-white font-bold rounded-md">
            {isSubmitting ? "Loading..." : "  Let's Go"}
          </button>
          <div className="flex mt-3 justify-center gap-1">
            New account ?
            <p
              className="text-primary font-bold cursor-pointer"
              onClick={() => navigate("/register")}
            >
              {" "}
              Register{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
