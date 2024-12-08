import React, { useState } from 'react';
import { Play, Info, TrendingUp, Star, Search, Bell, UserCircle2 } from 'lucide-react';
import Navbar from './components/Navbar';
import ContentRow from './components/ContentRow';
import FeaturedContent from './components/FeaturedContent';
import ChatSidebar from './components/chat/ChatSidebar';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorAlert from './components/ErrorAlert';
import GenreNav from './components/GenreNav';
import useError from './hooks/useError';

function App() {
  const { error, clearError } = useError();
  const [selectedGenre, setSelectedGenre] = useState('action');

  // Filter content based on selected genre
  const filterContentByGenre = (items: any[], genre: string) => {
    if (!genre) return items;
    return items.filter(item => item.genres?.includes(genre));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#141414] text-white">
        {error && (
          <ErrorAlert 
            message={error.message} 
            onDismiss={clearError}
          />
        )}
        <Navbar />
        <main className="pb-20">
          <FeaturedContent />
          
          <div className="relative z-10 -mt-32">
            <GenreNav 
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
            />
            
            <div className="space-y-8 px-4 md:px-8">
              <ContentRow 
                title="Trending Now" 
                icon={<TrendingUp className="w-5 h-5" />}
                items={filterContentByGenre(trendingItems, selectedGenre)} 
              />
              <ContentRow 
                title="Top Rated" 
                icon={<Star className="w-5 h-5" />}
                items={filterContentByGenre(topRatedItems, selectedGenre)} 
              />
              <ContentRow 
                title="New Releases" 
                items={filterContentByGenre(newReleases, selectedGenre)} 
              />
            </div>
          </div>
        </main>
        <ChatSidebar />
      </div>
    </ErrorBoundary>
  );
}

// Sample data with genres and local video files
const trendingItems = [
  {
    id: 1,
    title: "Mountain Adventure",
    image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&auto=format",
    rating: 4.8,
    videoUrl: "/uploads/content/mountain-adventure.mp4",
    thumbnailUrl: "/uploads/thumbnails/mountain-adventure.jpg",
    genres: ['action', 'drama'],
    likes: 1234,
    shares: 456,
    comments: 89
  },
  {
    id: 2,
    title: "Space Journey",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format",
    rating: 4.7,
    videoUrl: "/uploads/content/space-journey.mp4",
    thumbnailUrl: "/uploads/thumbnails/space-journey.jpg",
    genres: ['scifi', 'drama'],
    likes: 2345,
    shares: 678,
    comments: 123
  },
  {
    id: 3,
    title: "City Life",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=500&auto=format",
    rating: 4.5,
    videoUrl: "/uploads/content/city-life.mp4",
    thumbnailUrl: "/uploads/thumbnails/city-life.jpg",
    genres: ['drama', 'romance'],
    likes: 3456,
    shares: 789,
    comments: 234
  }
];

const topRatedItems = [
  {
    id: 6,
    title: "Aerial Views",
    image: "https://images.unsplash.com/photo-1682686580186-b55d2a91053c?w=500&auto=format",
    rating: 4.9,
    videoUrl: "/uploads/content/aerial-views.mp4",
    thumbnailUrl: "/uploads/thumbnails/aerial-views.jpg",
    genres: ['action', 'scifi'],
    likes: 5678,
    shares: 890,
    comments: 345
  },
  {
    id: 7,
    title: "Digital World",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format",
    rating: 4.8,
    videoUrl: "/uploads/content/digital-world.mp4",
    thumbnailUrl: "/uploads/thumbnails/digital-world.jpg",
    genres: ['scifi', 'animation'],
    likes: 6789,
    shares: 901,
    comments: 456
  },
  {
    id: 8,
    title: "Night Scenes",
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500&auto=format",
    rating: 4.7,
    videoUrl: "/uploads/content/night-scenes.mp4",
    thumbnailUrl: "/uploads/thumbnails/night-scenes.jpg",
    genres: ['horror'],
    likes: 7890,
    shares: 123,
    comments: 567
  }
];

const newReleases = [
  {
    id: 11,
    title: "Urban Dreams",
    image: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=500&auto=format",
    rating: 4.4,
    videoUrl: "/uploads/content/urban-dreams.mp4",
    thumbnailUrl: "/uploads/thumbnails/urban-dreams.jpg",
    genres: ['scifi', 'action'],
    likes: 8901,
    shares: 234,
    comments: 678
  },
  {
    id: 12,
    title: "Game World",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format",
    rating: 4.3,
    videoUrl: "/uploads/content/game-world.mp4",
    thumbnailUrl: "/uploads/thumbnails/game-world.jpg",
    genres: ['gaming', 'animation'],
    likes: 9012,
    shares: 345,
    comments: 789
  },
  {
    id: 13,
    title: "Love Story",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format",
    rating: 4.6,
    videoUrl: "/uploads/content/love-story.mp4",
    thumbnailUrl: "/uploads/thumbnails/love-story.jpg",
    genres: ['romance', 'drama'],
    likes: 1234,
    shares: 456,
    comments: 890
  }
];

export default App;