import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Loading from "./Loading";
import UserFirst from "./UserFirst";

export default function SearchUser({ setSearched }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultSearch, setResultSearch] = useState([]);
  const handleSearched = useCallback(async () => {
    try {
      setLoading(true);
      let response = await axios.post("http://localhost:8000/api/search_user", {
        search: search,
      });
      setLoading(false);
      setResultSearch(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }, [search]);

  useEffect(() => {
    if (search !== "") {
      handleSearched();
    }
  }, [handleSearched, search]);
  return (
    <div className="fixed top-0 left-0 bg-slate-700 opacity-80  w-full h-screen flex justify-center z-30">
      <div className="mt-20 w-full max-w-md px-3 space-y-2">
        <div className="w-full bg-white flex justify-between items-center rounded-md">
          <input
            type="text"
            placeholder="search with name or email"
            className="w-full p-3 outline-none border-none caret-slate-300 rounded-md"
            onChange={(e) => setSearch(e.target.value)}
          />
          <CiSearch className="mr-5" size={20} />
        </div>
        <div className="bg-white rounded-md p-3 min-h-12 scrollbar h-80 overflow-y-scroll">
          {loading && <Loading />}
          {resultSearch?.length > 0 &&
            search !== "" &&
            resultSearch.map((user) => (
              <UserFirst user={user} key={user._id} setSearched={setSearched} />
            ))}
          {resultSearch?.length === 0 && search !== "" && (
            <p className="text-sm text-slate-700 mx-auto text-center font-semibold">
              Not Found User
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
