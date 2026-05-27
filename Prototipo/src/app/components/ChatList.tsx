import { X, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Chat {
  id: string;
  otherPersonName: string;
  otherPersonPhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  isActive: boolean;
  jobType: string;
}

interface ChatListProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToMain: () => void;
  chats: Chat[];
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ isOpen, onClose, onBackToMain, chats, onChatSelect }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredChats = chats.filter(chat =>
    chat.otherPersonName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChats = filteredChats.filter(c => c.isActive);
  const inactiveChats = filteredChats.filter(c => !c.isActive);

  return (
    <>
      {/* Chat List - Full Screen */}
      <div className="fixed inset-0 bg-[#FAF8F5] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b bg-[#685AA1] text-white relative">
          <h2 className="text-2xl font-medium">Mensajes</h2>
        </div>

        {/* Search */}
        <div className="p-4 border-b bg-white">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversaciones..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-2xl mx-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle size={48} className="mb-4 text-gray-300" />
              <p>No hay conversaciones</p>
            </div>
          ) : (
            <>
              {/* Active Chats */}
              {activeChats.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                    Conversaciones Activas
                  </div>
                  {activeChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onChatSelect(chat.id)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors border-b flex items-start gap-3 text-left"
                    >
                      <div className="relative flex-shrink-0">
                        <ImageWithFallback
                          src={chat.otherPersonPhoto}
                          alt={chat.otherPersonName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.unread && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium truncate ${chat.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {chat.otherPersonName}
                          </h3>
                          <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-[#685AA1] font-medium mb-1">{chat.jobType}</p>
                        <p className={`text-sm truncate ${chat.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                          {chat.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Inactive Chats */}
              {inactiveChats.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                    Conversaciones Finalizadas
                  </div>
                  {inactiveChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onChatSelect(chat.id)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors border-b flex items-start gap-3 text-left opacity-75"
                    >
                      <ImageWithFallback
                        src={chat.otherPersonPhoto}
                        alt={chat.otherPersonName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate text-gray-700">
                            {chat.otherPersonName}
                          </h3>
                          <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-[#685AA1] font-medium mb-1">{chat.jobType}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </>
  );
}
