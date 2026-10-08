import { X, Send, ArrowLeft, CheckCircle, Home, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RequestServiceModal } from './RequestServiceModal';
import { RatingModal } from './RatingModal';
import { InvoiceModal } from './InvoiceModal';
import { InvoiceMessage } from './InvoiceMessage';

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  type: 'material' | 'labor';
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  isMine: boolean;
  type?: 'text' | 'invoice';
  invoiceData?: {
    items: InvoiceItem[];
    total: number;
    isPaid: boolean;
    invoiceId: string;
    paymentMethod: 'efectivo' | 'tarjeta';
    status?: 'programada' | 'pendiente' | 'aceptada' | 'rechazada';
    deliveryMode?: 'al_finalizar' | 'fecha';
    scheduledDate?: string | null;
  };
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onBackToMain: () => void;
  chatData: {
    id: string;
    otherPersonName: string;
    otherPersonPhoto: string;
    isActive: boolean;
    jobType: string;
    messages: Message[];
    clientRated?: boolean;
    professionalRated?: boolean;
  };
  currentUserId: string;
  currentUserData: any;
  userType: 'client' | 'professional';
  onMarkFinished?: () => void;
  onSendMessage?: (chatId: string, message: string) => void;
  onRate?: (chatId: string, rating: number, comment: string) => void;
  onViewProfile?: () => void;
  savedCards?: any[];
  onSendInvoice?: (chatId: string, items: InvoiceItem[], deliveryMode: 'al_finalizar' | 'fecha', scheduledDate: string) => Promise<void>;
  onRespondQuote?: (chatId: string, quoteId: string, decision: 'aceptada' | 'rechazada') => void;
}

export function ChatWindow({
  isOpen,
  onClose,
  onBack,
  onBackToMain,
  chatData,
  currentUserId,
  currentUserData,
  userType,
  onMarkFinished,
  onSendMessage,
  onRate,
  onViewProfile,
  savedCards = [],
  onSendInvoice,
  onRespondQuote
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Show rating modal for client when entering a finished chat they haven't rated
  useEffect(() => {
    if (userType === 'client' && !chatData.isActive && !chatData.clientRated) {
      setShowRatingModal(true);
    }
  }, [userType, chatData.isActive, chatData.clientRated]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Send message via callback
    if (onSendMessage) {
      onSendMessage(chatData.id, newMessage);
    }
    setNewMessage('');
  };

  const handleRequestAgain = () => {
    setShowRequestModal(true);
  };

  const handleFinishWork = () => {
    onMarkFinished?.();
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (userType === 'client' && onRate) {
      onRate(chatData.id, rating, comment);
    }
    setShowRatingModal(false);
  };

  const handleSendInvoice = async (items: InvoiceItem[], deliveryMode: 'al_finalizar' | 'fecha', scheduledDate: string) => {
    if (onSendInvoice) {
      await onSendInvoice(chatData.id, items, deliveryMode, scheduledDate);
    }
    setShowInvoiceModal(false);
  };

  return (
    <>
      {/* Chat Window - Full Screen */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-[#685AA1] text-white">
          <div className="max-w-2xl mx-auto grid grid-cols-3 items-center p-4">
            {/* Left: Back Button */}
            <div className="flex justify-start">
              <button
                onClick={onBack}
                className="p-2 hover:bg-[#685AA1]/80 rounded-lg transition-colors"
                title="Volver a chats"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            {/* Center: Photo and Name */}
            <div className="flex flex-col items-center">
              <button
                onClick={onViewProfile}
                className="hover:opacity-80 transition-opacity"
                title="Ver perfil"
              >
                <ImageWithFallback
                  src={chatData.otherPersonPhoto}
                  alt={chatData.otherPersonName}
                  className="w-12 h-12 rounded-full object-cover mb-1 border-2 border-white"
                />
              </button>
              <h3 className="font-medium text-sm text-center">{chatData.otherPersonName}</h3>
              <p className="text-xs text-white/80">{chatData.jobType}</p>
            </div>

            {/* Right: Actions */}
            <div className="flex justify-end gap-1">
              {userType === 'professional' && (
                <>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="p-2 bg-[#FFC900] hover:bg-[#e6b500] text-[#1D1D1B] rounded-lg transition-colors"
                    title="Enviar presupuesto"
                  >
                    <CreditCard size={20} />
                  </button>
                  {chatData.isActive && (
                    <button
                      onClick={handleFinishWork}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      title="Marcar como finalizado"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Banner - Below Header */}
        {!chatData.isActive && (
          <div className="px-4 py-3 bg-green-50 border-b border-green-200 text-center">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-green-800">
                ✓ El proyecto de trabajo con {chatData.otherPersonName} ha finalizado
              </p>
              {userType === 'client' && !chatData.clientRated && (
                <p className="text-xs text-green-700 mt-1">
                  Por favor califica el servicio recibido
                </p>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-2xl mx-auto space-y-4">
            {chatData.messages.map((message) => {
              // Invoice message
              if (message.type === 'invoice' && message.invoiceData) {
                return (
                  <div key={message.id}>
                    <InvoiceMessage
                      items={message.invoiceData.items}
                      total={message.invoiceData.total}
                      clientName={userType === 'professional' ? chatData.otherPersonName : currentUserData.name + (currentUserData.lastName ? ' ' + currentUserData.lastName : '')}
                      professionalName={userType === 'client' ? chatData.otherPersonName : currentUserData.name + (currentUserData.lastName ? ' ' + currentUserData.lastName : '')}
                      jobType={chatData.jobType}
                      timestamp={message.timestamp}
                      userType={userType}
                      paymentMethod={message.invoiceData.paymentMethod}
                      status={message.invoiceData.status}
                      deliveryMode={message.invoiceData.deliveryMode}
                      scheduledDate={message.invoiceData.scheduledDate}
                      onRespond={
                        userType === 'client' && message.invoiceData.status === 'pendiente'
                          ? (decision) => onRespondQuote?.(chatData.id, message.invoiceData!.invoiceId, decision)
                          : undefined
                      }
                    />
                  </div>
                );
              }

              // Regular text message
              const isPaymentConfirmation = message.text?.includes('✓') && message.text?.includes('ha sido recibido con éxito');

              return (
                <div
                  key={message.id}
                  className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isPaymentConfirmation
                        ? 'bg-green-50 border-2 border-green-200 text-green-800'
                        : message.isMine
                        ? 'bg-[#685AA1] text-white'
                        : 'bg-[#D3CFED] text-[#1D1D1B]'
                    }`}
                  >
                    {isPaymentConfirmation && (
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">Pago Confirmado</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      isPaymentConfirmation
                        ? 'text-green-600'
                        : message.isMine
                        ? 'text-white/80'
                        : 'text-gray-600'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        {chatData.isActive ? (
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="max-w-2xl mx-auto flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#685AA1]"
              />
              <button
                type="submit"
                className="p-3 bg-[#FFC900] text-[#1D1D1B] rounded-full hover:bg-[#e6b500] transition-colors"
              >
                <Send size={24} />
              </button>
            </div>
          </form>
        ) : (
          // Only show "Request Again" button for clients
          userType === 'client' ? (
            <div className="p-4 border-t bg-white">
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={handleRequestAgain}
                  className="w-full px-4 py-3 bg-[#FFC900] text-[#1D1D1B] font-medium rounded-lg hover:bg-[#e6b500] transition-colors"
                >
                  Solicitar de Nuevo
                </button>
              </div>
            </div>
          ) : (
            // For professionals, just show a message
            <div className="p-4 border-t bg-white">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-gray-600 text-sm">
                  El chat ha finalizado
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Request Again Modal */}
      {userType === 'client' && !chatData.isActive && (
        <RequestServiceModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          clientData={currentUserData}
          professionalName={chatData.otherPersonName}
          category={chatData.jobType}
          savedCards={savedCards}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        targetName={chatData.otherPersonName}
        userType={userType}
      />

      {/* Invoice Modal - For Professional to create invoice */}
      {userType === 'professional' && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          clientName={chatData.otherPersonName}
          jobType={chatData.jobType}
          onSendInvoice={handleSendInvoice}
        />
      )}
    </>
  );
}
