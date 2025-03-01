import { Github, Instagram, Linkedin, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";


const Footer = () => {
    return (
        <footer className="flex flex-col">
            <div className="flex lg:flex-row flex-col gap-8 justify-around items-center py-4 bg-blue-100 dark:bg-[#2E3A52] md:px-10 px-4">
                <div className="">
                    <Link to={'/'} className="flex items-center justify-center gap-3">
                        <img src="logo.png" alt="QuizLabs" className="md:h-20 h-16 mr-0" />
                    </Link>
                    <p className="text-gray-200 mb-2">
                        Transform YouTube videos into interactive quizzes and insightful summaries.
                    </p>
                    <div className="flex flex-row gap-2 w-full items-center justify-center">
                        <Link to={"https://github.com/Vermasaiyam"} target="blank" title="Github" className="bg-white dark:bg-[#6D758C] p-1.5 rounded-full flex items-center justify-center">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link to={"https://www.linkedin.com/in/saiyam05/"} target="blank" title="LinkedIn" className="bg-white dark:bg-[#6D758C] p-1.5 rounded-full flex items-center justify-center">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link to={"https://x.com/SaiyamVerm91813/"} target="blank" title="X" className="bg-white dark:bg-[#6D758C] p-1.5 rounded-full flex items-center justify-center">
                            <X className="w-5 h-5" />
                        </Link>
                        <Link to={"https://www.instagram.com/s.verma0504/"} target="blank" title="Instagram" className="bg-white dark:bg-[#6D758C] p-1.5 rounded-full flex items-center justify-center">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link to={"mailto:vermasaiyam9@gmail.com"} target="blank" title="E-mail" className="bg-white dark:bg-[#6D758C] p-1.5 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row md:gap-16 gap-4">
                    <div className="flex flex-col md:gap-3 gap-2">
                        <h1 className="font-bold text-red-400 dark:text-white md:text-lg text-xs">Support</h1>
                        <div className="flex flex-col gap-1 md:text-base text-xs dark:text-yellow-100">
                            <div className="">Account</div>
                            <div className="">Support Center</div>
                            <div className="">Feedback</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:gap-3 gap-2">
                        <h1 className="font-bold text-red-400 dark:text-white md:text-lg text-xs">Useful Links</h1>
                        <div className="flex flex-col gap-1 md:text-base text-xs dark:text-yellow-100">
                            <div className="">Payment & Tax</div>
                            <div className="">Terms of Service</div>
                            <div className="">Privacy Policy</div>
                            <div className="">About Us</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:gap-3 gap-2">
                        <h1 className="font-bold text-red-400 dark:text-white md:text-lg text-xs">Get In Touch</h1>
                        <div className="flex flex-col gap-1 md:text-base text-xs dark:text-yellow-100">
                            <div className="">vermasaiyam9@gmail.com</div>
                            <div className="">QuizLab</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 dark:bg-[#6D758C] text-center text-gray-300 md:py-5 py-4 px-4">
                <p className="text-sm text-red-600">
                    Copyright &copy; 2025 <span className="text-red-700 font-bold">Photo-AI</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;