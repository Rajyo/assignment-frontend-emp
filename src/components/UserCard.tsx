import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteUserApi } from "../api";
import { deleteUser, getUsers as getLocalUsers } from "../data";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { UserCardProps } from "../types";

const UserCard = ({ setLocalUsers, ...user }: UserCardProps) => {
  const navigate = useNavigate();
  const [loadingDelete, setLoadingDelete] = useState(false);

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
    <motion.div
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
  );
};

export default UserCard;
