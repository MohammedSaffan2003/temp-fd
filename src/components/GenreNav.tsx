import React from 'react';
import { Film, Gamepad2, Heart, Laugh, Rocket, Sword, Theater, Umbrella } from 'lucide-react';

const genres = [
  { id: 'action', name: 'Action', icon: <Sword className="w-4 h-4" /> },
  { id: 'drama', name: 'Drama', icon: <Theater className="w-4 h-4" /> },
  { id: 'comedy', name: 'Comedy', icon: <Laugh className="w-4 h-4" /> },
  { id: 'scifi', name: 'Sci-Fi', icon: <Rocket className="w-4 h-4" /> },
  { id: 'romance', name: 'Romance', icon: <Heart className="w-4 h-4" /> },
  { id: 'animation', name: 'Animation', icon: <Film className="w-4 h-4" /> },
  { id: 'horror', name: 'Horror', icon: <Umbrella className="w-4 h-4" /> },
  { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> }
];

interface GenreNavProps {
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

const GenreNav: React.FC<GenreNavProps> = ({ selectedGenre, onGenreSelect }) => {
  return (
    <nav className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 p-4 min-w-max">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              selectedGenre === genre.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre.icon}
            <span className="text-sm font-medium">{genre.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default GenreNav;