import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, User, Building, Send, FileText, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { OrderCheckoutData, Order } from '../types';
import { formatNaira } from '../utils/format';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discount, total, placeOrder } = useCart();

  const [fullName, setFullName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [telegramInfo, setTelegramInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !roomNumber.trim() || !telegramInfo.trim()) {
      alert("Please enter your Full Name, Room Number, and Telegram contact number.");
      return;
    }

    const checkoutData: OrderCheckoutData = {
      fullName: fullName.trim(),
      roomNumber: roomNumber.trim(),
      telegramHandleOrPhone: telegramInfo.trim(),
      notes: notes.trim()
    };

    const order = placeOrder(checkoutData);
    setCompletedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-24 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C21E3C]" />
            <span>RETURN TO CATALOGUE</span>
          </Link>

          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            SECURE CHECKOUT
          </span>
        </div>

        {/* COMPLETED ORDER CONFIRMATION STATE */}
        {completedOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-[#0A0A0A] border border-neutral-850 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-8"
          >
            <div className="flex flex-col items-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 rounded-full bg-[#C21E3C]/10 border border-[#C21E3C]/30 text-[#C21E3C] flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <span className="text-xs font-mono text-[#C21E3C] uppercase tracking-[0.25em] font-bold">
                ORDER SUCCESSFULLY PLACED
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                ORDER #{completedOrder.id}
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm font-mono max-w-md">
                Your retro kits have been dispatched for express direct room delivery to <span className="text-white font-bold">{completedOrder.checkoutInfo.roomNumber}</span>.
              </p>
            </div>

            {/* Clean Receipt Breakdown */}
            <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 text-left font-mono text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">CUSTOMER NAME</span>
                  <span className="text-white font-bold">{completedOrder.checkoutInfo.fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">ROOM LOCATION</span>
                  <span className="text-[#C21E3C] font-bold">{completedOrder.checkoutInfo.roomNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">TELEGRAM CONTACT</span>
                  <span className="text-white">{completedOrder.checkoutInfo.telegramHandleOrPhone}</span>
                </div>
              </div>

              {completedOrder.checkoutInfo.notes && (
                <div className="pb-3 border-b border-neutral-800 text-neutral-400">
                  <span className="text-neutral-500 block text-[10px] uppercase">DELIVERY NOTES:</span>
                  <span>"{completedOrder.checkoutInfo.notes}"</span>
                </div>
              )}

              {/* Ordered Items List */}
              <div className="space-y-3 pt-2">
                <span className="text-neutral-400 block font-bold text-[11px] uppercase tracking-wider">
                  ORDERED KITS:
                </span>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-neutral-300 py-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.jersey.mainImage}
                        alt={item.jersey.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-900"
                      />
                      <div>
                        <span className="text-white font-bold block">{item.jersey.name}</span>
                        <span className="text-neutral-500 text-[10px]">SIZE: {item.size} • QTY: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-white">{formatNaira(item.jersey.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-white pt-4 border-t border-neutral-800">
                <span>TOTAL PAID:</span>
                <span className="text-[#C21E3C] text-lg font-mono">{formatNaira(completedOrder.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-[#C21E3C] hover:bg-[#A0152F] text-white px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all"
              >
                RETURN TO STORE
              </Link>
            </div>
          </motion.div>
        ) : cartItems.length === 0 ? (
          /* EMPTY CART CHECKOUT STATE */
          <div className="max-w-xl mx-auto text-center py-20 bg-[#0A0A0A] border border-neutral-850 rounded-3xl p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#C21E3C]" />
            </div>
            <h2 className="font-display text-2xl font-extrabold uppercase text-white">
              YOUR BAG IS CURRENTLY EMPTY
            </h2>
            <p className="text-neutral-400 text-xs font-mono">
              Add vintage jerseys or retro streetwear grails to your bag to proceed with express room checkout.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#C21E3C] text-white px-8 py-3.5 rounded-full font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#A0152F] transition-colors"
            >
              <span>EXPLORE CATALOGUE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* REGULAR FULL PAGE CHECKOUT FORM */
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#C21E3C] uppercase tracking-[0.25em] font-bold block">
                EXPRESS ROOM DELIVERY
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                CHECKOUT DETAILS
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Input Form */}
              <div className="lg:col-span-7 bg-[#0A0A0A] border border-neutral-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                <div className="border-b border-neutral-900 pb-4">
                  <h2 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C21E3C]" />
                    <span>DELIVERY RECIPIENT INFO</span>
                  </h2>
                </div>

                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block uppercase font-medium">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 rounded-2xl px-5 py-3.5 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C] transition-colors"
                  />
                </div>

                {/* Room Number Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-neutral-300 block uppercase font-medium flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#C21E3C]" />
                      <span>ROOM NUMBER *</span>
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      EXAMPLE: Daniel E304
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniel E304"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 rounded-2xl px-5 py-3.5 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C] transition-colors"
                  />
                </div>

                {/* Telegram Number / Contact */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block uppercase font-medium flex items-center gap-1">
                    <Send className="w-3.5 h-3.5 text-[#C21E3C]" />
                    <span>TELEGRAM NUMBER / HANDLE *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @daniel_zoid or +234 801 234 5678"
                    value={telegramInfo}
                    onChange={(e) => setTelegramInfo(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 rounded-2xl px-5 py-3.5 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C] transition-colors"
                  />
                </div>

                {/* Optional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 block uppercase font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-neutral-500" />
                    <span>OPTIONAL NOTES</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Special instructions e.g. Call before coming, drop with roommate..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-800 rounded-2xl px-5 py-3.5 text-sm font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-[#C21E3C] transition-colors"
                  />
                </div>

                <div className="pt-4 flex items-center gap-4 text-xs font-mono text-neutral-400 border-t border-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ZOID Express Guarantee • Payment confirmed upon direct room dropoff</span>
                </div>

              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 bg-[#0A0A0A] border border-neutral-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
                
                <div className="border-b border-neutral-900 pb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#C21E3C]" />
                    <span>WHAT YOU ORDERED</span>
                  </h2>
                  <span className="text-xs font-mono text-neutral-400 font-bold">
                    ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} ITEMS)
                  </span>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.jersey.id}-${item.size}`}
                      className="bg-[#121212] border border-neutral-850 rounded-2xl p-3.5 flex items-center gap-3.5"
                    >
                      <img
                        src={item.jersey.mainImage}
                        alt={item.jersey.name}
                        className="w-16 h-16 rounded-xl object-cover bg-neutral-950 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                          {item.jersey.clubOrCountry}
                        </span>
                        <h4 className="font-sans text-sm font-medium text-white truncate">
                          {item.jersey.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs font-mono">
                          <span className="text-[#C21E3C] font-bold">SIZE: {item.size} • QTY: {item.quantity}</span>
                          <span className="text-white font-bold">{formatNaira(item.jersey.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Delivery Breakdown */}
                <div className="space-y-2 text-xs font-mono text-neutral-400 border-t border-neutral-900 pt-4">
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="text-white font-bold">{formatNaira(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#C21E3C]">
                      <span>PROMO DISCOUNT</span>
                      <span>-{formatNaira(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ROOM DELIVERY</span>
                    </span>
                    <span className="text-emerald-400 font-bold">FREE EXPRESS</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
                    <span>TOTAL PAYMENT</span>
                    <span className="text-[#C21E3C] text-lg">{formatNaira(total)}</span>
                  </div>
                </div>

                {/* Submit Order CTA Button */}
                <button
                  type="submit"
                  className="w-full bg-[#C21E3C] hover:bg-[#A0152F] text-white py-4 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-[#C21E3C]/20 hover:scale-[1.01]"
                >
                  CONFIRM & PLACE ORDER NOW
                </button>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
