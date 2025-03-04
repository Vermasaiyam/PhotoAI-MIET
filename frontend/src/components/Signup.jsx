import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { X } from "lucide-react";

const API_END_POINT =
    import.meta.env.VITE_API_END_POINT_USER ||
    "https://Photo-AI.onrender.com/api/user";

const Signup = () => {
    const [show, setShow] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const [input, setInput] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [useCamera, setUseCamera] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            setImage(blob);
            setImagePreview(URL.createObjectURL(blob));
        }, "image/jpeg");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error("Please capture your photo before signing up.");
            return;
        }

        try {
            setLoading(true);

            // Step 1: Upload user details & image to Node.js backend
            const formData = new FormData();
            formData.append("username", input.username);
            formData.append("email", input.email);
            formData.append("password", input.password);
            formData.append("photo", image);

            // console.log("Formdata", formData);
            for (let pair of formData.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }

            const res = await axios.post(`${API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (!res.data.success) {
                throw new Error(res.data.message || "User registration failed");
            }

            // Step 2: Extract image URL from backend response
            const imageUrl = res.data.imageUrl;
            if (!imageUrl) {
                throw new Error("Image URL not received from backend");
            }

            // Step 3: Send the image URL to Flask server for encoding
            const flaskResponse = await axios.post("http://127.0.0.1:5000/encode", {
                image_url: imageUrl,
            });

            if (flaskResponse.data.error) {
                throw new Error(flaskResponse.data.error);
            }

            const faceEncodings = flaskResponse.data.encodings;
            if (faceEncodings.length === 0) {
                throw new Error("No face detected in the image");
            }

            // Step 4: Send face encoding to Node.js backend for storage
            await axios.post(`${API_END_POINT}/store-face-encoding`, {
                email: input.email,
                faceEncoding: faceEncodings[0], // Assuming one face is detected
            });

            toast.success("Signup successful! Face encoding stored.");
            navigate("/login");

            // Reset input fields
            setInput({ username: "", email: "", password: "" });
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen bg-black overflow-y-auto">
            {/* Full-screen background image */}
            <img
                src="redbg.jpg"
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover bg-black opacity-20"
            />

            {/* Signup form with transparent black background */}
            <form
                onSubmit={signupHandler}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg flex flex-col gap-3 p-4 max-w-sm w-[90%] bg-black/90 z-10 rounded-lg my-4"
            >
                <h1 className="text-center font-bold text-3xl text-white mb-1">
                    Create account
                </h1>
                <p className="text-center text-gray-300 text-sm mb-2">
                    Upload an image or capture a photo.
                </p>

                <input
                    type="text"
                    name="username"
                    value={input.username}
                    onChange={changeEventHandler}
                    placeholder="Username"
                    className="p-2.5 border border-white rounded-md w-full text-white bg-transparent text-sm"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    placeholder="Email"
                    className="p-2.5 border border-white rounded-md w-full text-white bg-transparent text-sm"
                    required
                />

                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="Password"
                        className="p-2.5 border border-white rounded-md w-full pr-10 text-white bg-transparent text-sm"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                        {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2">
                    {imagePreview ? (
                        <div className="relative w-full">
                            <img
                                src={imagePreview}
                                alt="Selected"
                                className="w-full h-48 object-contain border border-white rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImage(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : useCamera ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            className="w-full h-48 object-cover border border-white rounded-md"
                        />
                    ) : null}

                    <div className="flex gap-2 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                    </div>

                    <div className="flex gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => {
                                setUseCamera(true);
                                startCamera();
                            }}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                            Use Camera
                        </button>
                        {useCamera && (
                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                            >
                                Capture
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <button
                        disabled
                        className="flex items-center justify-center p-2.5 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed mt-2"
                    >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="p-2.5 bg-[#042035] hover:bg-[#165686] text-white rounded-md cursor-pointer mt-2 transition-colors"
                    >
                        Signup
                    </button>
                )}

                <span className="text-center text-gray-300 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400">
                        Login
                    </Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;