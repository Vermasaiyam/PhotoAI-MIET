import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";
import axios from "axios";
import { Menu, X } from "lucide-react";

const API_END_POINT = import.meta.env.VITE_API_END_POINT_USER;

export default function Header() {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${API_END_POINT}/logout`, {
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                dispatch(setAuthUser(null));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header className="text-white shadow-md backdrop-blur-sm bg-black top-0 fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">
                {/* Logo */}
                <Link to={"/"} className="flex items-center gap-3">
                    <img
                        src={"logo.png"}
                        alt="Photo-AIs"
                        className="md:h-16 h-12 scale-200 ml-10"
                    />
                </Link>

                {/* Hamburger Menu - Visible on Mobile */}
                <button
                    className="md:hidden text-white focus:outline-none cursor-pointer p-2"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Navbar - Desktop */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map(({ name, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={name}
                                to={path}
                                className={`relative text-lg transition-all duration-300 ${isActive
                                        ? "font-bold text-white"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {name}
                            </Link>
                        );
                    })}

                    {/* User Dropdown */}
                    <div className="relative">
                        {user ? (
                            <>
                                <div onClick={toggleDropdown} className="cursor-pointer">
                                    <img
                                        src={user?.profilePicture || "/user.png"}
                                        alt="User Icon"
                                        className="w-9 h-9 rounded-full border-2 border-white"
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                                        <ul className="py-2">
                                            <li>
                                                <Link
                                                    to={`/profile/${user?._id}`}
                                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={logoutHandler}
                                                    className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 text-left cursor-pointer"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="bg-red-500 hover:bg-red-700 transition-all duration-200 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* Mobile Menu - Only visible when menu is open */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-sm shadow-lg z-10">
                    <nav className="flex flex-col items-center space-y-4 py-6">
                        {navItems.map(({ name, path }) => {
                            const isActive = location.pathname === path;
                            return (
                                <Link
                                    key={name}
                                    to={path}
                                    className={`text-lg transition-all duration-300 ${isActive
                                            ? "font-bold text-white"
                                            : "text-gray-300 hover:text-white"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {name}
                                </Link>
                            );
                        })}

                        {/* User Dropdown in Mobile Menu */}
                        {user ? (
                            <>
                                <Link
                                    to={`/profile/${user?._id}`}
                                    className="text-lg text-gray-300 hover:text-white"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="text-lg text-gray-300 hover:text-white cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <button className="bg-red-500 hover:bg-red-700 transition-all duration-200 text-white font-bold py-2 px-6 rounded-lg">
                                    Login
                                </button>
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}