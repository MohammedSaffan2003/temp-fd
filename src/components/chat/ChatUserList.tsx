import React from 'react';

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatUserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

const ChatUserList: React.FC<ChatUserListProps> = ({ users, onSelectUser }) => {
  return (
    <div className="divide-y divide-gray-800">
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className="w-full p-4 flex items-center space-x-3 hover:bg-white/5 transition-colors"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {user.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]" />
            )}
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium">{user.name}</h3>
            {user.lastMessage && (
              <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
            )}
          </div>
          {user.lastMessageTime && (
            <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ChatUserList;