import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getUsers as getUsersApi } from "../api";
import { getUsers as getLocalUsers, setUsers } from "../data";
import { User } from "../types";
import debounce from "../utils/debounce";
import UserCard from "../components/UserCard";

const UserList: React.FC = () => {
  const [users, setLocalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

  // Fetch users
  const fetchUsers = async (index=1) => {
    setLoading(true);
    try {
      const response = await getUsersApi(index);
      setUsers(response.data);
      setLocalUsers(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on page change
  useEffect(() => {
    const localUsers = getLocalUsers();
    if (localUsers.length === 0) {
      fetchUsers();
    } else {
      setLocalUsers(localUsers);
    }
  }, [currentPage]);

  // Search(Debounced)
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const filteredUsers = getLocalUsers().filter(
        (user) =>
          user.first_name.toLowerCase().includes(term.toLowerCase()) ||
          user.last_name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase())
      );
      setLocalUsers(filteredUsers);
    }, 300),
    []
  );

  // Handle search
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);


  // Ref
  const ref = useRef<HTMLInputElement | null>(null);

  // Handle click outside
  const onClickOutside = () => {
    setSearchTerm("");
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node | null)) {
        onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <div className="bg-gray-50 sm:p-6 p-3">
      {/* Header (SEARCH + REFRESH DATA) */}
      <div className="flex justify-between items-center bg-gray-200 sticky top-[5rem] sm:top-[5.5rem] sm:p-6 py-6 gap-x-2 px-3 max-w-6xl mx-auto z-10">
        {/* Search */}
        <div className="flex items-center gap-4 rounded-xl shadow-lg max-w-4xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={ref}
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {/* REFRESH DATA */}
        <button
          onClick={() => fetchUsers(currentPage)}
          className="flex items-center gap-2 sm:px-4 px-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="sm:flex hidden">Refresh Data</span>
        </button>
      </div>

      {/* Users DATA */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && users.length === 0 ? (
            // Loader
            <div className="col-span-3 flex justify-center items-center sm:my-40 my-20">
              <Loader2 className="animate-spin text-indigo-500 sm:w-36 sm:h-36 w-10 h-10" />
            </div>
          ) : !loading && users.length === 0 ? (
            // No Users Found
            <div className="col-span-3 flex justify-center items-center sm:my-40 my-20">
              <h1 className="sm:text-5xl tracking-tight text-2xl font-semibold text-red-500">
                No User Found
              </h1>
            </div>
          ) : (
            // User Cards
            <AnimatePresence>
              {users.map((user) => (
                <UserCard key={user.id} {...user} setLocalUsers={setLocalUsers} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchUsers(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                i === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
