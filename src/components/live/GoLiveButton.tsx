import React, { useState } from 'react';
import { Video } from 'lucide-react';
import GoLiveModal from './GoLiveModal';

const GoLiveButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
      >
        <Video className="w-5 h-5" />
        <span>Go Live</span>
      </button>

      <GoLiveModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default GoLiveButton;