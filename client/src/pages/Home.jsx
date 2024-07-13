import React, { useCallback, useEffect } from "react";
import Sidebars from "../componants/Sidebars";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setLogout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/slice/userSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import logo from "../assets/logo.png";
export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state=>state?.user)
  const detailsUser = useCallback(async () => {
    try {
      let response = await axios.get("http://localhost:8000/api/detailsUser", {
        withCredentials: true,
      });

      if (response?.data?.data?._id) {
        dispatch(setUser(response?.data?.data));
      }
      if (response?.data?.data?.logout) {
        dispatch(setLogout());
        navigate("/checkemail");
      }
    } catch (error) {
      console.log(error);
    }
  }, [navigate, dispatch]);
  useEffect(() => {
    detailsUser();
  }, [detailsUser]);
  const pathname = location.pathname;
  /////socket io//////////
  useEffect(() => {
    const socket = io("http://localhost:8000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    } );
    if ( user?._id ) {
       socket.on("connect", () => {
         socket.on("onlineUser", (data) => {
           dispatch(setOnlineUser(data));
         });
       });
       dispatch(setSocketConnection(socket));
       return () => {
         socket.off("onlineUser");
       };
    }
   
  }, [dispatch, user?._id]);
  /////socket io/////////
  return (
    <div className="grid lg:grid-cols-[320px,1fr] ">
      <div className={`${pathname !== "/" && "lg:block hidden"}`}>
        <Sidebars />
      </div>
      <div
        className={`
         
         ${pathname === "/" && "hidden"}`}
      >
        <Outlet />
      </div>

      <div
        className={`${
          pathname === "/" &&
          "lg:flex justify-center items-center flex-col gap-3 hidden"
        }  ${pathname !== "/" && "hidden"}`}
      >
        <img src={logo} alt="logo" className="w-60" />
        <p className="text-lg text-slate-400">Select user to send message</p>
      </div>
    </div>
  );
}
