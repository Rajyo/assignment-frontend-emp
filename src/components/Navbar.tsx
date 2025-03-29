import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    // Navbar
    <nav className="flex justify-around items-center mb-8 py-6 bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-200 fixed top-0 left-0 right-0 z-10">
      {/* Heading */}
      <h1 className="md:text-4xl sm:text-3xl min-[350px]:text-2xl text-xl font-bold text-gray-800 tracking-tight">
        User Management
      </h1>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 sm:px-4 px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span className="sm:flex hidden">Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;
