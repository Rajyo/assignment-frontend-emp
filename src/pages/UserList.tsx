import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit2, Trash2, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { getUsers as getUsersApi, deleteUserApi } from "../api";
import { getUsers as getLocalUsers, setUsers, deleteUser } from "../data";
import { User } from "../types";
import debounce from "../utils/debounce";

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setLocalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log(users);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersApi(currentPage);
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


  // Handle delete
  const handleDelete = async (id: number) => {
    setLoadingDelete(true);
    try {
      await deleteUserApi(id);
      deleteUser(id);
      setLocalUsers(getLocalUsers());
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="bg-gray-50 sm:p-6 p-3">
      {/* Header (SEARCH + REFRESH DATA) */}
      <div className="flex justify-between items-center bg-gray-200 sticky top-[5rem] sm:top-[5.5rem] sm:p-6 py-6 gap-x-2 px-3 max-w-6xl mx-auto z-10">
        {/* Search */}
        <div className="flex items-center gap-4 rounded-xl shadow-lg max-w-4xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {/* REFRESH DATA */}
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 sm:px-4 px-2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="sm:flex hidden">Refresh Data</span>
        </button>
      </div>

      {/* Users DATA */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loader
            <div className="col-span-3 flex justify-center items-center sm:my-40 my-20">
              <Loader2 className="animate-spin text-indigo-500 sm:w-36 sm:h-36 w-10 h-10" />
            </div>
          ) : (
            // User Cards
            <AnimatePresence>
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-lg transition duration-200 hover:bg-slate-50 group"
                >
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-24 h-24 rounded-full mx-auto mb-4 group-hover:grayscale-0 grayscale transition duration-200"
                  />
                  <h3 className="sm:text-xl text-lg font-semibold text-center text-gray-800">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-gray-600 sm:text-sm text-xs text-center mb-4">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 sm:mt-8 mt-5">
                    <button
                      disabled={loadingDelete}
                      onClick={() => navigate(`/edit/${user.id}`)}
                      className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 ${
                        loadingDelete ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      disabled={loadingDelete}
                      onClick={() => handleDelete(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ${
                        loadingDelete ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

          {/* Pagination */}
        <div className="flex justify-center mt-8 gap-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
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
