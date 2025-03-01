import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice.js';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const API_END_POINT = import.meta.env.VITE_API_END_POINT_USER || "https://quizlab.onrender.com/api/user";

const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const { user } = useSelector(store => store.auth);


    const [input, setinput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setinput({
                    email: "",
                    password: ""
                });
            }
            setLoading(false);

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='flex flex-col items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 py-10 max-w-lg w-full'>
                <div className='mb-1 -mt-12'>
                    <h1 className='text-center font-bold text-4xl m-3 mt-5'>Login to your account</h1>
                    <p className='text-base text-center'>Please log in to your account to proceed.</p>
                </div>

                <div>
                    <span className='font-medium text-gray-700'>Email <span className='text-base text-red-700'>*</span></span>
                    <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder="Enter your email"
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <span className='font-medium text-gray-700'>Password <span className='text-base text-red-700'>*</span></span>
                    <div className="relative">
                        <input
                            type={show ? "text" : "password"}
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick();
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                        >
                            {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                </div>

                {
                    loading ? (
                        <button className="flex items-center justify-center w-full p-3 mt-4 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </button>
                    ) : (
                        <button type='submit' className="w-full p-3 mt-4 bg-[#042035] hover:bg-[#165686] text-white rounded-md focus:outline-none transition-all cursor-pointer">
                            Login
                        </button>
                    )
                }

                <span className='text-center'>
                    Don't have an account?
                    <Link to="/signup" className='text-blue-600 mx-1'>Signup</Link>
                </span>
            </form>
        </div>
    )
}

export default Login