import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardSkeleton from "./skeletons/DashboardSkeleton";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user: reduxUser } = useSelector((store) => store.auth);
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [groupUrl, setGroupUrl] = useState("");
    const [loading, setLoading] = useState(true);
    // Fetch User Details
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/user/${reduxUser._id}`
                );
                setUser(response.data);
                setGroups(
                    Array.isArray(response.data.groups) ? response.data.groups : []
                );
                setLoading(false);
                console.log("Fetched groups:", response.data.groups);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (reduxUser?._id) {
            fetchUserData();
        }
    }, [reduxUser]);

    // Handle Join New Group
    const handleJoinGroup = async () => {
        if (!groupUrl.trim()) return;

        window.history.pushState(null, "", groupUrl);
        window.location.reload();
    };

    if (!user) return <DashboardSkeleton />;

    return (
        <div className="relative min-h-[60vh] bg-black text-gray-100 select-none pb-20">
            {/* Full-screen background image */}
            <img
                src="redbg.jpg"
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover opacity-20 z-0 select-none"
            />
            {/* Content overlay */}
            <div className="relative z-10">
                <div className="container mx-auto px-3 py-4">
                    <div className="flex items-center justify-between mb-4 mx-6">
                        <h1 className="text-2xl font-bold text-white">Joined Groups</h1>
                        <button
                            className="bg-[#042035] hover:bg-[#165686] text-white px-4 py-2 text-sm rounded-lg transition-colors duration-200"
                            onClick={() => setShowModal(true)}
                        >
                            Join New Group
                        </button>
                    </div>
                    {/* Display the URL Section */}
                    {groupUrl && (
                        <div className="mt-4 p-3 bg-white border rounded-lg shadow">
                            <span className="font-semibold">Entered Group URL:</span>{" "}
                            {groupUrl}
                        </div>
                    )}

                    {!groups || groups.length === 0 ? (
                        <div className="text-center py-8">
                            <h2 className="text-xl text-gray-400 mb-2">No groups found</h2>
                            <p className="text-sm text-gray-500">
                                Create a new group to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 mx-4">
                            {groups.length > 0 ? (
                                groups.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() => navigate(`/group/${group._id}`)}
                                        className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700"
                                    >
                                        <div className="relative w-full aspect-square mb-2">
                                            <img
                                                src={group.photos?.[0]?.url || defaultGroupImage}
                                                alt={group.groupName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = defaultGroupImage;
                                                }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-2">
                                                <h2 className="text-lg font-semibold text-white">
                                                    {group.groupName}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <div className="grid grid-cols-4 gap-1 mb-2">
                                                {group.photos?.slice(1, 4).map((photo, index) => (
                                                    <div
                                                        key={index}
                                                        className="aspect-square rounded overflow-hidden bg-gray-700"
                                                    >
                                                        <img
                                                            src={photo.url}
                                                            alt={`Group photo ${index + 2}`}
                                                            className="w-full h-full object-cover hover:opacity-75 transition-opacity duration-200"
                                                            onError={(e) => {
                                                                e.target.src = defaultGroupImage;
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                                <div className="aspect-square rounded overflow-hidden bg-gray-700/50 flex flex-col justify-center items-center hover:bg-gray-700 transition-colors duration-200">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-5 h-5 text-blue-500"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                    <span className="text-xs text-gray-300 mt-0.5">
                                                        View All
                                                    </span>
                                                </div>
                                            </div>
                                            {group.photos?.length > 0 && (
                                                <div className="text-xs text-gray-400 flex items-center justify-end">
                                                    <span className="bg-gray-700/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                        {group.photos.length} photos
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full">
                                    You are not part of any groups yet.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal for Entering Group URL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-semibold mb-4">Enter Group URL</h2>
                        <input
                            type="text"
                            value={groupUrl}
                            onChange={(e) => setGroupUrl(e.target.value)}
                            placeholder="Paste group URL here"
                            className="border border-gray-300 px-4 py-2 rounded-md w-full bg-white focus:ring focus:ring-blue-300"
                        />
                        <div className="mt-4 flex justify-between">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                onClick={handleJoinGroup}
                            >
                                Join
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}