import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import { useSelector } from "react-redux";

export default function UploadImagePage() {
    const [groupName, setGroupName] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { user } = useSelector((store) => store.auth);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (!groupName.trim()) {
            alert("Please enter a group name.");
            return;
        }

        if (images.length === 0) {
            alert("Please select images to upload.");
            return;
        }

        setLoading(true);

        try {
            // Step 1: Upload images to Node.js backend
            const formData = new FormData();
            images.forEach((image) => {
                formData.append("images", image);
            });

            console.log("FormData before sending:", formData.getAll("images"));

            const uploadResponse = await axios.post(
                "http://localhost:8000/api/group/upload-images",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const uploadedPhotos = uploadResponse.data.urls; // Array of Cloudinary URLs

            // Step 2: Send Cloudinary URLs to Python backend for encoding
            const encodingResponse = await axios.post(
                "http://127.0.0.1:5000/encode-multiple",
                {
                    images: uploadedPhotos,
                }
            );

            const photosWithEncodings = encodingResponse.data.results.map((item) => ({
                url: item.image_url,
                encoding: Array.isArray(item.encodings)
                    ? item.encodings.map(Number)
                    : [],
            }));

            // Step 3: Send final data to Node.js backend to store in MongoDB
            const groupResponse = await axios.post(
                "http://localhost:8000/api/group/create-group",
                {
                    userId: user._id,
                    groupName,
                    photos: photosWithEncodings,
                }
            );

            const groupId = groupResponse.data.groupId;
            navigate(`/group/${groupId}`);
        } catch (error) {
            console.error("Error processing images:", error);
            alert("Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="relative w-full min-h-[60vh] bg-black">
            {/* Full-screen background image with overlay */}
            <img
                src="redbg.jpg"
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover bg-black opacity-20"
            />

            {/* Upload form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg flex flex-col gap-3 p-4 max-w-sm w-[90%] bg-black/90 z-10 rounded-lg my-4">
                <h1 className="text-center font-bold text-3xl text-white">
                    Create a New Group
                </h1>
                <p className="text-center text-gray-300 text-sm">
                    Upload images to create a new group.
                </p>

                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="p-2.5 border border-white rounded-md w-full text-white bg-transparent text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />

                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                    Select Images
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Selected"
                                    className="w-20 h-20 object-cover rounded-md shadow-md"
                                />
                                <button
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    <Trash size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    className="p-2.5 bg-[#042035] hover:bg-[#165686] text-white rounded-md cursor-pointer transition-colors"
                    disabled={loading}
                    onClick={handleUpload}
                >
                    {loading ? "Uploading..." : "Upload & Create Group"}
                </button>
            </div>
        </div>
    );
}