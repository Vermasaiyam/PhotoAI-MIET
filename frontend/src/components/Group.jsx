import React, { useState, useEffect } from "react";
import GroupSkeleton from "./skeletons/GroupSkeleton";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";

import {
    Share2,
    Download,
    Check,
    Copy,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import JSZip from "jszip";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
} from "react-share";
import { FaXTwitter } from "react-icons/fa6";

const GroupImages = () => {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [groupUrl, setGroupUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [slideDirection, setSlideDirection] = useState("right");
    const [showPopup, setShowPopup] = useState(false);

    // Fixed group reference issue - created a derived value instead of using undefined variable
    const group = {
        photos: images.map((image, index) => ({
            ...image,
            id: image.id || index, // Ensure each image has an id
        })),
        link: groupUrl,
    };

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/group/${id}`
                );
                console.log("response: ", response.data);

                setGroupName(response.data.name);
                setImages(response.data.photos);
                setGroupUrl(response.data.url);
            } catch (err) {
                setError("Failed to fetch images");
            } finally {
                setLoading(false);
            }
        };
        fetchGroupData();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) return;
            if (e.key === "ArrowLeft") {
                navigateImage("left");
            } else if (e.key === "ArrowRight") {
                navigateImage("right");
            } else if (e.key === "Escape") {
                setSelectedImageIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImageIndex]);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(group.link);
            toast.success("Link copied to clipboard!");
            setShowCopiedTooltip(true);
            setTimeout(() => setShowCopiedTooltip(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handlePhotoSelect = (photoId) => {
        setSelectedPhotos((prev) => {
            if (prev.includes(photoId)) {
                return prev.filter((id) => id !== photoId);
            }
            return [...prev, photoId];
        });
    };

    const handleSelectAll = () => {
        if (selectedPhotos.length === group.photos.length) {
            setSelectedPhotos([]);
        } else {
            setSelectedPhotos(group.photos.map((photo) => photo.id));
        }
    };

    // Fetch an image and return its blob
    const downloadImage = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return blob;
        } catch (error) {
            toast.error("Failed to download image");
            return null;
        }
    };

    // Download a single image by creating a temporary download link
    const downloadSingleImage = async (url) => {
        try {
            const blob = await downloadImage(url);
            if (!blob) return;

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `photo-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            toast.error("Failed to download image");
        }
    };

    // Download all images (used when nothing is selected)
    const downloadAllImages = async () => {
        if (group.photos.length === 0) return;

        // If only one image exists, download it directly
        if (group.photos.length === 1) {
            await downloadSingleImage(group.photos[0].url);
            toast.success("Download complete!");
            return;
        }

        const loadingToast = toast.loading("Creating zip file...");
        try {
            const zip = new JSZip();
            const imagePromises = group.photos.map(async (photo, index) => {
                const blob = await downloadImage(photo.url);
                if (blob) {
                    const filename = `photo-${index + 1}.jpg`;
                    zip.file(filename, blob);
                }
            });

            await Promise.all(imagePromises);

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const downloadUrl = window.URL.createObjectURL(zipBlob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `gallery-${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success("Download complete!", { id: loadingToast });
        } catch (error) {
            console.error("Error creating zip:", error);
            toast.error("Failed to create zip file", { id: loadingToast });
        }
    };

    // Download selected images using similar logic to downloadAllImages
    const downloadSelected = async () => {
        const selectedImages = group.photos.filter((photo) =>
            selectedPhotos.includes(photo.id)
        );
        if (selectedImages.length === 0) {
            toast.error("No images selected");
            return;
        }
        if (selectedImages.length === 1) {
            await downloadSingleImage(selectedImages[0].url);
            toast.success("Download complete!");
            return;
        }

        const loadingToast = toast.loading("Creating zip file...");
        try {
            const zip = new JSZip();
            const imagePromises = selectedImages.map(async (photo, index) => {
                const blob = await downloadImage(photo.url);
                if (blob) {
                    const filename = `photo-${index + 1}.jpg`;
                    zip.file(filename, blob);
                }
            });

            await Promise.all(imagePromises);

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const downloadUrl = window.URL.createObjectURL(zipBlob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `gallery-${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast.success("Download complete!", { id: loadingToast });
        } catch (error) {
            console.error("Error creating zip:", error);
            toast.error("Failed to create zip file", { id: loadingToast });
        }
    };

    const navigateImage = (direction) => {
        setSlideDirection(direction);
        setSelectedImageIndex((prevIndex) => {
            if (direction === "left") {
                return prevIndex === 0 ? group.photos.length - 1 : prevIndex - 1;
            } else {
                return prevIndex === group.photos.length - 1 ? 0 : prevIndex + 1;
            }
        });
    };

    if (loading) {
        return <GroupSkeleton />;
    }

    return (
        <div className="relative min-h-screen bg-black text-gray-100 select-none">
            {/* Full-screen background image */}
            <img
                src="/redbg.jpg"
                alt=""
                aria-hidden="true"
                className="fixed inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none select-none"
            />

            {/* Content overlay */}
            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col space-y-4 mb-8">
                        {/* Title and Share */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white">
                                {groupName || "Group Images"}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <button
                                    // onClick={handleShare}
                                    onClick={() => setShowPopup(true)}
                                    className="flex items-center space-x-2 bg-[#042035] hover:bg-[#165686] px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Link Display */}
                        <div className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg">
                            <span className="text-gray-400">Link:</span>
                            <span className="flex-1 truncate">{groupUrl}</span>
                            <button
                                onClick={handleShare}
                                className="text-blue-500 hover:text-blue-400"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleSelectAll}
                                    className="flex items-center space-x-2 bg-gray-700/80 hover:bg-gray-600 px-4 py-2 rounded-lg"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>
                                        {selectedPhotos.length === group.photos.length
                                            ? "Deselect All"
                                            : "Select All"}
                                    </span>
                                </button>
                                {selectedPhotos.length > 0 && (
                                    <span className="text-gray-400">
                                        {selectedPhotos.length} selected
                                    </span>
                                )}
                            </div>
                            {selectedPhotos.length > 0 ? (
                                <button
                                    onClick={downloadSelected}
                                    className="flex items-center space-x-2 bg-[#042035] hover:bg-[#165686] px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download Selected</span>
                                </button>
                            ) : (
                                <button
                                    onClick={downloadAllImages}
                                    className="flex items-center space-x-2 bg-[#042035] hover:bg-[#165686] px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download All</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.length > 0 ? (
                            images.map((photo, index) => (
                                <div key={index} className="relative group">
                                    {/* Checkbox */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedPhotos.includes(photo.id || index)}
                                            onChange={() => handlePhotoSelect(photo.id || index)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#165686] focus:ring-[#165686]"
                                        />
                                    </div>

                                    {/* Download Button for individual image */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadSingleImage(photo.url);
                                        }}
                                        className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 backdrop-blur-sm rounded-full hover:bg-gray-800 transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>

                                    {/* Image */}
                                    <div
                                        className="aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-800/80 backdrop-blur-sm"
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <img
                                            src={photo.url}
                                            alt={`Photo ${photo.id || index}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-full">No images found.</p>
                        )}
                    </div>
                </div>
            </div>

            {showPopup && (
                <SharePopup qrValue={groupUrl} onClose={() => setShowPopup(false)} />
            )}

            {/* Image Modal */}
            {selectedImageIndex !== null && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => navigateImage("left")}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-50 bg-black/50 backdrop-blur-sm p-2 rounded-full"
                    >
                        <ChevronLeft className="w-12 h-12" />
                    </button>
                    <button
                        onClick={() => navigateImage("right")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-50 bg-black/50 backdrop-blur-sm p-2 rounded-full"
                    >
                        <ChevronRight className="w-12 h-12" />
                    </button>

                    {/* Image Container */}
                    <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={images[selectedImageIndex]?.url}
                                alt={`Photo ${images[selectedImageIndex]?.id || selectedImageIndex
                                    }`}
                                className={`max-w-full max-h-[90vh] object-contain transform transition-all duration-300 ease-in-out
                                    ${slideDirection === "right"
                                        ? "slide-in-right"
                                        : "slide-in-left"
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default GroupImages;

const SharePopup = ({ qrValue, onClose }) => {
    const shareUrl = qrValue; // URL to be shared

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-md animate-fadeIn">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-center w-[350px] relative border border-gray-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Share QR Code
                </h2>

                {/* QR Code */}
                <div className="flex justify-center">
                    <QRCodeCanvas
                        value={qrValue}
                        size={180}
                        className="p-2 border rounded-md bg-white shadow"
                    />
                </div>

                {/* Social Media Share Buttons */}
                <div className="flex justify-center gap-5 mt-5">
                    <WhatsappShareButton url={shareUrl}>
                        <FaWhatsapp className="text-green-500 w-10 h-10 hover:scale-110 transition-transform" />
                    </WhatsappShareButton>
                    <TwitterShareButton url={shareUrl}>
                        <FaXTwitter className="text-black w-10 h-10 hover:scale-110 transition-transform" />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl}>
                        <FaLinkedin className="text-blue-700 w-10 h-10 hover:scale-110 transition-transform" />
                    </LinkedinShareButton>
                    <FacebookShareButton url={shareUrl}>
                        <FaFacebook className="text-blue-600 w-10 h-10 hover:scale-110 transition-transform" />
                    </FacebookShareButton>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-6 px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};