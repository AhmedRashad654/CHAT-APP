import React from "react";
import logo from "../assets/logo.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OutLayet({ children }) {
  return (
    <>
      <ToastContainer position="top-center" />
      <div className="w-100 text-center py-3 shadow-md bg-white">
        <img
          src={logo}
          alt="logo"
          className="mx-auto"
          width={120}
          height={100}
        />
      </div>
      {children}
    </>
  );
}
