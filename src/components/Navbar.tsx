import React, { useState } from 'react';
import { Bell, Film, UserCircle2, LogOut, Upload } from 'lucide-react';
import AISearchBar from './search/AISearchBar';
import AuthModal from './auth/AuthModal';
import UploadModal from './upload/UploadModal';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleSearch = async (query: string) => {
    try {
      // Handle search results - you can update global state or trigger a route change
      console.log('Searching for:', query);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh content or show success message
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <Film className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <AISearchBar onSearch={handleSearch} />
            </div>

            <div className="flex items-center space-x-6">
              {user && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              )}

              <button className="text-gray-300 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profileImage || 'https://via.placeholder.com/32'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <UserCircle2 className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default Navbar;