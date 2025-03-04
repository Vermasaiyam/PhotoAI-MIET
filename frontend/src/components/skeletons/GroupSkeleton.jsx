import React, { useState } from "react";
import { Download, Check } from "lucide-react";

const GroupSkeleton = ({ groupName = "Group Images", images = [] }) => {
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const handleSelectAll = () => {
        if (selectedPhotos.length === images.length) {
            setSelectedPhotos([]);
        } else {
            setSelectedPhotos(images.map((_, index) => index));
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-gray-100 select-none">
            {/* Content overlay */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col space-y-4 mb-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white">{groupName}</h1>
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
                                        {selectedPhotos.length === images.length
                                            ? "Deselect All"
                                            : "Select All"}
                                    </span>
                                </button>
                            </div>
                            <button className="flex items-center space-x-2 bg-[#042035] hover:bg-[#165686] px-4 py-2 rounded-lg transition-colors duration-200">
                                <Download className="w-5 h-5" />
                                <span>Download All</span>
                            </button>
                        </div>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.length > 0 ? (
                            images.map((photo, index) => (
                                <div key={index} className="relative group">
                                    {/* Image */}
                                    <div className="aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-800/80 backdrop-blur-sm">
                                        <img
                                            src={photo.url}
                                            alt={`Photo ${index}`}
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
        </div>
    );
};

export default GroupSkeleton;