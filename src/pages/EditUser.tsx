import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { updateUserApi } from "../api";
import { getUsers, updateUser } from "../data";
import { userSchema, UserFormData } from "../schemas/user";
import { ZodError } from "zod";

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  // Fetch Single user data
  useEffect(() => {
    const user = getUsers().find((u) => u.id === Number(id));
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
      setAvatar(user.avatar);
    }
  }, [id]);

  // Validate Data
  const validateField = (field: keyof UserFormData, value: string) => {
    try {
      userSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setValidating(false);
    } catch (error) {
      setValidating(true);
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  // Handle form change
  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = userSchema.parse(formData);
      setLoading(true);

      await updateUserApi(Number(id), validatedData);
      updateUser(Number(id), validatedData);
      toast.success("User updated successfully!");
      navigate("/users");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 sm:p-6 p-3">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl sm:p-8 p-5"
        >
          {/* Back Button */}
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <button
              onClick={() => navigate("/users")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Users
            </button>
          </div>

          {/* Heading */}
          <h2 className="text-4xl tracking-tight text-center mb-12 font-bold text-gray-800">
            Edit User Profile
          </h2>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-50 shadow-lg">
                <img
                  src={avatar}
                  alt={`${formData.first_name} ${formData.last_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                Profile
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.first_name && (
                  <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.first_name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                    errors.last_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.last_name && (
                  <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.last_name}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-4 flex-wrap">
              <button
                type="submit"
                disabled={loading || validating}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/users")}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditUser;
