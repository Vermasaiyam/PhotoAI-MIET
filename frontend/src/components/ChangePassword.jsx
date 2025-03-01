import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_END_POINT = import.meta.env.VITE_API_END_POINT_USER;

export default function ChangePassword() {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (key, value) => {
        setPasswordData(prev => ({ ...prev, [key]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not match!");
        }

        setIsLoading(true);
        try {
            const res = await axios.post(`${API_END_POINT}/change-password`, passwordData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/profile/${user?._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while changing the password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 min-h-[70vh] mt-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Change Password</h1>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-4 max-w-2xl mx-auto"
            >
                {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
                    <div className="mb-2" key={index}>
                        <label className="block text-gray-700 font-bold mb-2">
                            {field === 'oldPassword' ? 'Old Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword[field] ? "text" : "password"}
                                value={passwordData[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility(field)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                            >
                                {showPassword[field] ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>
                ))}
                <div>
                    <button
                        disabled={isLoading}
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-[#2A3B5F] hover:bg-[#0B1930] transition-all duration-200 text-white font-bold py-2 px-4 rounded focus:outline-none cursor-pointer focus:shadow-outline"
                    >
                        {isLoading ? "Changing Password..." : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}