import { Github, Instagram, Linkedin, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="flex flex-col bg-black/70 backdrop-blur-sm">
            <div className="flex lg:flex-row flex-col gap-8 justify-around items-center py-4 bg-black/90 backdrop-blur-sm text-white md:px-10 px-4">
                <div className="">
                    <Link to={"/"} className="flex items-center justify-center gap-3">
                        <img
                            src={"logo.png"}
                            alt="Photo-AIs"
                            className="md:h-20 h-16 mr-0 scale-200"
                        />
                    </Link>
                    <p className="text-gray-200 mb-2">Your Photos Your Privacy.</p>
                    <div className="flex flex-row gap-2 w-full items-center justify-center">
                        <Link
                            to={"https://github.com/Vermasaiyam"}
                            target="blank"
                            title="Github"
                            className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link
                            to={"https://www.linkedin.com/in/saiyam05/"}
                            target="blank"
                            title="LinkedIn"
                            className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link
                            to={"https://x.com/SaiyamVerm91813/"}
                            target="blank"
                            title="X"
                            className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </Link>
                        <Link
                            to={"https://www.instagram.com/s.verma0504/"}
                            target="blank"
                            title="Instagram"
                            className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link
                            to={"mailto:vermasaiyam9@gmail.com"}
                            target="blank"
                            title="E-mail"
                            className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row md:gap-16 gap-4">
                    <div className="flex flex-col md:gap-3 gap-2">
                        <h1 className="font-bold text-white md:text-lg text-xs">Support</h1>
                        <div className="flex flex-col gap-1 md:text-base text-xs text-gray-300">
                            <div className="hover:text-white transition-colors">Account</div>
                            <div className="hover:text-white transition-colors">
                                Support Center
                            </div>
                            <div className="hover:text-white transition-colors">Feedback</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:gap-3 gap-2">
                        <h1 className="font-bold text-white md:text-lg text-xs">
                            Useful Links
                        </h1>
                        <div className="flex flex-col gap-1 md:text-base text-xs text-gray-300">
                            <div className="hover:text-white transition-colors">
                                Payment & Tax
                            </div>
                            <div className="hover:text-white transition-colors">
                                Terms of Service
                            </div>
                            <div className="hover:text-white transition-colors">
                                Privacy Policy
                            </div>
                            <div className="hover:text-white transition-colors">About Us</div>
                        </div>
                    </div>
                    <div className="flex flex-col md:gap-3 gap-2">
                        <h1 className="font-bold text-white md:text-lg text-xs">
                            Get In Touch
                        </h1>
                        <div className="flex flex-col gap-1 md:text-base text-xs text-gray-300">
                            <div className="hover:text-white transition-colors">
                                vermasaiyam9@gmail.com
                            </div>
                            <div className="hover:text-white transition-colors">Photo-AI</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm text-center py-4 px-4">
                <p className="text-sm text-white">
                    Copyright &copy; 2025 <span className="font-bold">Photo-AI</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;