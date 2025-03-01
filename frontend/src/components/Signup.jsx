import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const API_END_POINT = import.meta.env.VITE_API_END_POINT_USER || "https://Photo-AI.onrender.com/api/user";

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const [image, setImage] = useState(null);

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
        canvas.toBlob(blob => {
            setImage(blob);
        }, "image/jpeg");
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error("Please capture your photo before signing up.");
            return;
        }
        
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("username", input.username);
            formData.append("email", input.email);
            formData.append("password", input.password);
            formData.append("photo", image);

            const res = await axios.post(`${API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({ username: "", email: "", password: "" });
                setImage(null);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 py-10 max-w-lg w-full'>
                <h1 className='text-center font-bold text-4xl'>Create an account</h1>
                <p className='text-center'>To continue, fill out the personal info and capture a photo.</p>
                
                <input type="text" name="username" value={input.username} onChange={changeEventHandler} placeholder="Username" className="p-3 border rounded-md w-full" required />
                <input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" className="p-3 border rounded-md w-full" required />
                
                <div className="relative">
                    <input type={show ? "text" : "password"} name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" className="p-3 border rounded-md w-full pr-10" required />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
                
                <div className='flex flex-col items-center'>
                    <video ref={videoRef} autoPlay className='w-full max-h-64 border rounded-md' />
                    <button type='button' onClick={startCamera} className='mt-3 bg-blue-600 text-white px-4 py-2 rounded-md'>Start Camera</button>
                    <button type='button' onClick={capturePhoto} className='mt-2 bg-green-600 text-white px-4 py-2 rounded-md'>Capture Photo</button>
                </div>
                
                {image && <p className='text-green-600 text-center'>Photo captured successfully!</p>}
                
                {loading ? (
                    <button disabled className='flex items-center justify-center p-3 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed'>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </button>
                ) : (
                    <button type='submit' className='p-3 bg-[#042035] hover:bg-[#165686] text-white rounded-md cursor-pointer'>Signup</button>
                )}
                
                <span className='text-center'>
                    Already have an account? <Link to="/login" className='text-blue-600'>Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;