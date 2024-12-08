import React, { useState } from 'react';
import { MessageCircle, Users, Search, X } from 'lucide-react';
import ChatUserList from './ChatUserList';
import ChatMessage from './ChatMessage';

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format',
      online: true,
      lastMessage: 'Hey, what are you watching?',
      lastMessageTime: '2m ago'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&auto=format',
      online: true,
      lastMessage: 'This movie is amazing!',
      lastMessageTime: '5m ago'
    },
    {
      id: '3',
      name: 'Carol Williams',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&auto=format',
      online: false,
      lastMessage: "Let's watch together next time",
      lastMessageTime: '1h ago'
    }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[#1a1a1a] shadow-xl z-50 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Chat
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2b2b2b] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedUser ? (
              <ChatMessage user={selectedUser} onBack={() => setSelectedUser(null)} />
            ) : (
              <ChatUserList
                users={filteredUsers}
                onSelectUser={setSelectedUser}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;