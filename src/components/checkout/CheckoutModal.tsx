import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Send, Building, User, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { OrderCheckoutData, Order } from '../../types';
import { formatNaira } from '../../utils/format';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotal,
    discount,
    total,
    placeOrder
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [roomNumber, setRoomNumber] = useState('A102');
  const [customRoom, setCustomRoom] = useState('');
  const [telegramInfo, setTelegramInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isExpress, setIsExpress] = useState(false);

  const presetRooms = ['A102', 'B215', 'C307', 'D410', 'CUSTOM'];

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedRoom = roomNumber === 'CUSTOM' ? customRoom : roomNumber;

    if (!fullName.trim() || !selectedRoom.trim() || !telegramInfo.trim()) {
      alert("Please fill in your Name, Room Number, and Telegram contact.");
      return;
    }

    const checkoutData: OrderCheckoutData = {
      fullName: fullName.trim(),
      roomNumber: selectedRoom.trim(),
      telegramHandleOrPhone: telegramInfo.trim(),
      notes: notes.trim(),
      deliveryMethod: isExpress ? 'EXPRESS' : 'STANDARD'
    };

    const order = placeOrder(checkoutData);
    setCompletedOrder(order);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#0A0A0A] border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 text-white p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Receipt View */}
          {completedOrder ? (
            <div className="py-6 text-center flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 rounded-full bg-[#C21E3C]/20 text-[#C21E3C] border border-[#C21E3C]/40 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <span className="text-xs font-mono text-[#C21E3C] uppercase tracking-widest font-bold block mb-1">
                ORDER CONFIRMED
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-white mb-2">
                ORDER #{completedOrder.id}
              </h2>
              <p className="text-neutral-300 text-sm max-w-md mb-8">
                Your order is confirmed! Our runner is preparing your jerseys for fast room delivery to <strong className="text-white">Room {completedOrder.checkoutInfo.roomNumber}</strong>.
              </p>

              {/* Order Receipt Box */}
              <div className="w-full bg-[#111111] border border-neutral-800 rounded-2xl p-6 text-left font-mono text-xs space-y-3 mb-8">
                <div className="flex justify-between text-neutral-400 pb-2 border-b border-neutral-800">
                  <span>NAME:</span>
                  <span className="text-white font-bold">{completedOrder.checkoutInfo.fullName}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pb-2 border-b border-neutral-800">
                  <span>ROOM NUMBER:</span>
                  <span className="text-[#C21E3C] font-bold">ROOM {completedOrder.checkoutInfo.roomNumber}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pb-2 border-b border-neutral-800">
                  <span>TELEGRAM:</span>
                  <span className="text-white">{completedOrder.checkoutInfo.telegramHandleOrPhone}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pb-2 border-b border-neutral-800 mt-2">
                  <span>DELIVERY METHOD:</span>
                  <span className="text-white font-bold">{completedOrder.deliveryMethod === 'EXPRESS' ? 'Express (₦8,000)' : 'Standard (₦4,500)'}</span>
                </div>

                <div className="pt-2">
                  <span className="text-neutral-400 block mb-2 font-bold">JERSEYS ORDERED:</span>
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-300 py-1">
                      <span>{item.jersey.name} ({item.size}) x{item.quantity}</span>
                      <span>{formatNaira(item.jersey.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-neutral-800">
                  <span>TOTAL PAID:</span>
                  <span className="text-[#C21E3C]">{formatNaira(completedOrder.total + 4500 + (completedOrder.deliveryMethod === 'EXPRESS' ? 3500 : 0))}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="bg-[#C21E3C] text-white px-8 py-3.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase hover:bg-[#A0152F] transition-colors"
              >
                RETURN TO STORE
              </button>

              <div className="mt-8 bg-[#0088CC]/10 border border-[#0088CC]/30 rounded-2xl p-6 flex flex-col items-center w-full max-w-sm mx-auto">
                <Send className="w-8 h-8 text-[#0088CC] mb-3" />
                <h3 className="font-display text-lg font-bold uppercase text-white mb-2">JOIN OUR TELEGRAM COMMUNITY</h3>
                <p className="text-neutral-300 text-xs text-center mb-4 leading-relaxed">
                  Get real-time updates on deliveries, new drops, price changes & stock alerts
                </p>
                <a
                  href="https://t.me/zoidkits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0088CC] text-white px-6 py-3 rounded-full font-mono text-xs font-bold tracking-wider uppercase hover:bg-[#0077b5] transition-colors w-full text-center"
                >
                  JOIN ZOID TELEGRAM →
                </a>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <div>
              <div className="mb-6">
                <span className="text-xs font-mono text-[#C21E3C] uppercase tracking-widest font-bold block mb-1">
                  EXPRESS ROOM DELIVERY
                </span>
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
                  CHECKOUT & DELIVERY
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Form Fields */}
                <div className="md:col-span-7 space-y-5">
                  
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block uppercase mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C21E3C]" /> FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C]"
                    />
                  </div>

                  {/* Room Number Selection */}
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block uppercase mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#C21E3C]" /> ROOM NUMBER
                    </label>

                    {/* Room Presets */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {presetRooms.map((room) => (
                        <button
                          key={room}
                          type="button"
                          onClick={() => setRoomNumber(room)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all border ${
                            roomNumber === room
                              ? 'bg-[#C21E3C] text-white border-[#C21E3C]'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {room === 'CUSTOM' ? '+ OTHER' : `ROOM ${room}`}
                        </button>
                      ))}
                    </div>

                    {/* Custom Room Input */}
                    {roomNumber === 'CUSTOM' && (
                      <input
                        type="text"
                        required
                        placeholder="Enter Room Number (e.g. C307)"
                        value={customRoom}
                        onChange={(e) => setCustomRoom(e.target.value)}
                        className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C]"
                      />
                    )}
                  </div>

                  {/* Telegram Contact */}
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block uppercase mb-1.5 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#C21E3C]" /> TELEGRAM USERNAME OR PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="@telegram_handle or +234..."
                      value={telegramInfo}
                      onChange={(e) => setTelegramInfo(e.target.value)}
                      className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C]"
                    />
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block uppercase mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-neutral-500" /> OPTIONAL NOTES
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Special delivery instructions or size adjustments..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C]"
                    />
                  </div>

                  {/* Delivery Option */}
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block uppercase mb-1.5 flex items-center gap-1.5">
                      DELIVERY METHOD
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsExpress(false)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          !isExpress
                            ? 'bg-[#C21E3C]/10 border-[#C21E3C] text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="font-bold text-sm mb-1 text-white">Standard Delivery</div>
                        <div className="text-xs">3-5 working days</div>
                        <div className="text-xs mt-1 font-bold">₦4,500</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsExpress(true)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isExpress
                            ? 'bg-[#C21E3C]/10 border-[#C21E3C] text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="font-bold text-sm mb-1 text-white">Express Delivery</div>
                        <div className="text-xs">24-48 hours</div>
                        <div className="text-xs mt-1 font-bold">₦8,000</div>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Summary */}
                <div className="md:col-span-5 bg-[#111111] border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold uppercase text-white mb-4 border-b border-neutral-800 pb-2">
                      ORDER SUMMARY
                    </h3>

                    <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                          <img
                            src={item.jersey.mainImage}
                            alt={item.jersey.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold truncate">{item.jersey.name}</p>
                            <p className="text-neutral-400">SIZE: {item.size} • QTY: {item.quantity}</p>
                          </div>
                          <span className="text-white font-bold">{formatNaira(item.jersey.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 font-mono text-xs text-neutral-400 border-t border-neutral-800 pt-3">
                      <div className="flex justify-between">
                        <span>SUBTOTAL</span>
                        <span className="text-white">{formatNaira(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-[#C21E3C]">
                          <span>DISCOUNT</span>
                          <span>-{formatNaira(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>DELIVERY FEE</span>
                        <span className="text-white font-bold">{isExpress ? '₦8,000' : '₦4,500'}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-white border-t border-neutral-800 pt-2">
                        <span>TOTAL</span>
                        <span className="text-[#C21E3C]">{formatNaira(total + (isExpress ? 8000 : 4500))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Time Reminder */}
                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl px-4 py-3.5 flex gap-3 items-start">
                    <span className="text-amber-400 text-base leading-none mt-0.5">&#9888;</span>
                    <div>
                      <p className="text-amber-300 font-mono text-[9px] font-black uppercase tracking-wider mb-1">DELIVERY NOTICE</p>
                      <p className="text-amber-200/80 text-[11px] font-sans leading-relaxed">
                        Your order will arrive <strong>on or before 2 weeks</strong> from confirmed payment.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-[#C21E3C] hover:bg-[#A0152F] text-white py-3.5 rounded-full font-mono text-xs tracking-wider uppercase font-bold transition-all shadow-xl shadow-[#C21E3C]/25"
                  >
                    PLACE ORDER NOW
                  </button>
                </div>

              </form>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
