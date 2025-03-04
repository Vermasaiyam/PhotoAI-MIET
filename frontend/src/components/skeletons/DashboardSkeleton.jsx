
import React from "react";

const DashboardSkeleton = () => {
    // Create an array of placeholder items
    const skeletonItems = Array(10).fill(null);

    return (
        <div className="relative min-h-[60vh] bg-black text-gray-100 select-none pb-20">
            {/* Full-screen background image */}
            <div className="fixed inset-0 w-full h-full bg-black opacity-80 z-0 select-none" />

            {/* Content overlay */}
            <div className="relative z-10">
                <div className="container mx-auto px-3 py-4">
                    <div className="flex items-center justify-between mb-4 mx-6">
                        {/* Skeleton header */}
                        <div className="h-8 w-40 bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse" />
                    </div>

                    {/* Skeleton grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 mx-4">
                        {skeletonItems.map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700"
                            >
                                {/* Main image skeleton */}
                                <div className="relative w-full aspect-square mb-2">
                                    <div className="w-full h-full bg-gray-700 animate-pulse" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-2">
                                        <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse" />
                                    </div>
                                </div>

                                {/* Thumbnail grid skeleton */}
                                <div className="p-2">
                                    <div className="grid grid-cols-4 gap-1 mb-2">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded overflow-hidden bg-gray-700 animate-pulse"
                                            />
                                        ))}
                                        <div className="aspect-square rounded overflow-hidden bg-gray-700/50 flex flex-col justify-center items-center">
                                            <div className="w-5 h-5 rounded-full bg-gray-600 animate-pulse" />
                                            <div className="h-2 w-12 bg-gray-600 mt-1 rounded animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Photo count skeleton */}
                                    <div className="text-xs text-gray-400 flex items-center justify-end">
                                        <div className="h-4 w-16 bg-gray-700/50 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;