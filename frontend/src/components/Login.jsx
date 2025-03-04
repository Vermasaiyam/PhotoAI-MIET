import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_END_POINT =
    import.meta.env.VITE_API_END_POINT_USER ||
    "https://Photo-AI.onrender.com/api/user";

const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const { user } = useSelector((store) => store.auth);

    const [input, setinput] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setinput({
                    email: "",
                    password: "",
                });
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="relative w-screen h-screen bg-black overflow-y-auto">
            {/* Full-screen background image */}
            <img
                src="redbg.jpg"
                alt="Background"
                className="fixed inset-0 w-full h-full object-cover bg-black opacity-20"
            />

            {/* Login form */}
            <form
                onSubmit={signupHandler}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg flex flex-col gap-3 p-4 max-w-sm w-[90%] bg-black/90 z-10 rounded-lg my-4"
            >
                <h1 className="text-center font-bold text-3xl text-white mb-1">
                    Login to account
                </h1>
                <p className="text-center text-gray-300 text-sm mb-2">
                    Please log in to your account to proceed.
                </p>

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
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick();
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                        {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                </div>

                {loading ? (
                    <button
                        className="flex items-center justify-center p-2.5 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed mt-2"
                        disabled
                    >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="p-2.5 bg-[#042035] hover:bg-[#165686] text-white rounded-md cursor-pointer mt-2 transition-colors"
                    >
                        Login
                    </button>
                )}

                <span className="text-center text-gray-300 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-400">
                        Signup
                    </Link>
                </span>
            </form>
        </div>
    );
};

export default Login;