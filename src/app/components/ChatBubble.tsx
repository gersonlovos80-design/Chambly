import { MessageCircle, Home } from 'lucide-react';

interface ChatBubbleProps {
  onClick: () => void;
  hasUnread: boolean;
  showHomeIcon?: boolean;
}

export function ChatBubble({ onClick, hasUnread, showHomeIcon = false }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-[#FFC900] text-[#1D1D1B] rounded-full shadow-lg hover:bg-[#e6b500] transition-all hover:scale-110 flex items-center justify-center z-[60]"
    >
      {showHomeIcon ? <Home size={28} /> : <MessageCircle size={28} />}
      {!showHomeIcon && hasUnread && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
      )}
    </button>
  );
}
