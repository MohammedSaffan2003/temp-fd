import React from 'react';
import { Play, Info } from 'lucide-react';

const FeaturedContent = () => {
  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&auto=format"
          alt="Featured Content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Eternal Horizon</h1>
          <p className="text-lg text-gray-200">
            In a world where reality bends and time is fluid, one person's journey
            becomes an epic adventure that challenges the very fabric of existence.
          </p>
          
          <div className="flex space-x-4 pt-4">
            <button className="flex items-center space-x-2 px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors">
              <Play className="w-5 h-5 fill-black" />
              <span className="font-semibold">Play</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-2 bg-gray-500/75 text-white rounded hover:bg-gray-500/90 transition-colors">
              <Info className="w-5 h-5" />
              <span className="font-semibold">More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent;