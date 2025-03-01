import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useGetUserProfile from '../hooks/getUserProfile';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '../redux/authSlice';

const API_END_POINT = import.meta.env.VITE_API_END_POINT_USER;

const Profile = () => {
    const params = useParams();
    const userId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useGetUserProfile(userId);

    const { user } = useSelector(store => store.auth);

    if (!user) {
        return (
            <p className="min-w-full min-h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10" />
            </p>
        );
    }

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const userId = user._id; // You should have the user object from Redux or wherever you're storing it
                console.log("Deleting user with ID:", userId);  // Log to check if `userId` is available

                const response = await axios.delete(`${API_END_POINT}/delete/${userId}`);

                if (response.status === 200) {
                    toast.success("Account deleted successfully.");
                    navigate('/login');
                    dispatch(setAuthUser(null));
                } else {
                    toast.error("Error deleting account. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                toast.error("Error deleting account. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-[70vh] w-full items-center grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
                <img src={user?.profilePicture || '/user.png'} alt="Profile Picture" className="rounded-full w-52 h-52 mx-auto" />
                <Link to={`edit`}>
                    <button className="bg-[#2A3B5F] hover:bg-[#0B1930] transition-all duration-200 text-white py-2 px-4 rounded mt-4 cursor-pointer">
                        Edit Profile
                    </button>
                </Link>
            </div>

            <div className="flex flex-col gap-2">
                <div className="mb-4">
                    <p className="block text-gray-700 text-2xl font-bold mb-2">Full Name:</p>
                    <p className="text-gray-900 text-xl font-normal">{user?.username}</p>
                </div>
                <div className="mb-4">
                    <p className="block text-gray-700 text-2xl font-bold mb-2">Email:</p>
                    <p className="text-gray-900 text-xl font-normal">{user?.email}</p>
                </div>
                <div className="mb-4">
                    <p className="block text-gray-700 text-2xl font-bold mb-2">Joined On:</p>
                    <p className="text-gray-900 text-xl font-normal">
                        {moment(user?.createdAt).format('LL')}
                    </p>
                </div>

                <div className="flex md:space-x-4 space-x-2">
                    <Link to={'/history'}>
                        <button className="bg-[#2A3B5F] hover:bg-[#0B1930] transition-all duration-200 text-white font-bold py-2 md:px-4 px-3 rounded cursor-pointer md:text-base text-sm">
                            History
                        </button>
                    </Link>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-700 text-white py-2 md:px-4 px-2 rounded cursor-pointer md:text-base text-sm"
                    >
                        Delete Account
                    </button>
                    <Link to={'change-password'}>
                        <button className="bg-[#2A3B5F] hover:bg-[#0B1930] transition-all duration-200 text-white font-bold py-2 md:px-4 px-3 rounded cursor-pointer md:text-base text-sm">
                            Change Password
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;