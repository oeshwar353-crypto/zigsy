import React, { useState } from 'react';
import { useChat } from './context/ChatContext';
import {
    ArrowLeft,
    MapPin,
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScheduleReturn: React.FC = () => {
    const { scheduleReturn, navigate, activeConversationId } = useChat();

    const [selectedLocation, setSelectedLocation] = useState('College Main Gate');
    const [selectedDate, setSelectedDate] = useState<number>(1); // Day 1 selected
    const [selectedTime, setSelectedTime] = useState('11:30 AM');
    const [isSuccess, setIsSuccess] = useState(false);

    const locations = [
        { name: 'College Main Gate', desc: 'Central student entrance hub' },
        { name: 'Hostel Reception', desc: 'Safe indoor reception desk' },
        { name: 'Library', desc: 'Lobby study lounge area' },
        { name: 'Cafeteria', desc: 'Main food court entrance terrace' },
    ];

    const calendarDays = [
        { day: '28', active: true, select: false },
        { day: '29', active: true, select: false },
        { day: '30', active: true, select: false },
        { day: '1', active: true, select: true }, // selected day
        { day: '2', active: true, select: false },
        { day: '3', active: true, select: false },
        { day: '4', active: true, select: false },
        { day: '5', active: true, select: false },
        { day: '6', active: true, select: false },
        { day: '7', active: true, select: false },
    ];

    const timeSlots = ['09:00 AM', '11:30 AM', '02:15 PM', '05:00 PM'];

    const handleConfirm = () => {
        scheduleReturn({
            location: selectedLocation,
            date: `Oct ${selectedDate}, 2023`,
            timeSlot: selectedTime,
        });
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            navigate('chat', activeConversationId || 'sarah');
        }, 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden relative"
        >
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('chat', activeConversationId || 'sarah')}
                        className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Schedule Return</h1>
                </div>
                <div className="text-lg font-black text-[#C21807] uppercase tracking-tighter">
                    ZIGSY
                </div>
            </header>

            {/* Main Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-24">
                {/* Item Card */}
                <section className="flex gap-4 items-center bg-gray-50 p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-200">
                        <img
                            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300"
                            alt="Velvet Night Blazer"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-[#C21807] bg-red-50 border border-red-100/50 px-2.5 py-1 rounded-full leading-none inline-block">
                            RENTAL PERIOD ENDING
                        </span>
                        <h2 className="font-bold text-gray-900 text-base leading-tight">Velvet Night Blazer</h2>
                        <p className="text-xs text-gray-500 font-medium">Returning to: College Fashion Hub</p>
                    </div>
                </section>

                {/* Choose Location */}
                <section className="space-y-3">
                    <div className="flex items-center gap-1.5 text-[#C21807]">
                        <MapPin size={18} />
                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Choose Location</h3>
                    </div>

                    <div className="space-y-2">
                        {locations.map((loc) => {
                            const isSelected = selectedLocation === loc.name;
                            return (
                                <button
                                    key={loc.name}
                                    onClick={() => setSelectedLocation(loc.name)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left ${isSelected
                                        ? 'bg-[#C21807] border-transparent text-white shadow-md'
                                        : 'bg-gray-50 border-gray-100 text-gray-800 hover:border-[#C21807]/30'
                                        }`}
                                >
                                    <div>
                                        <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{loc.name}</p>
                                        <p className={`text-xs ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>{loc.desc}</p>
                                    </div>
                                    <ChevronRight size={16} className={isSelected ? 'text-white' : 'text-gray-400'} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Minimal Blueprint College Campus Map */}
                    <div className="w-full h-36 rounded-3xl overflow-hidden border border-gray-200 relative">
                        <div className="absolute inset-0 bg-[#f4f7f6] opacity-90 flex flex-col justify-center items-center p-3 text-center">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#C21807] mb-2 shadow-sm animate-bounce">
                                <MapPin size={18} fill="currentColor" />
                            </div>
                            <p className="text-xs font-bold text-gray-900">{selectedLocation}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Optimized coordinate drop spot selected</p>
                        </div>
                        {/* Minimalist Grid Pattern overlay */}
                        <div className="absolute inset-0 pointer-events-none border border-gray-100/10 grid grid-cols-6 grid-rows-3 opacity-20">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} className="border-r border-b border-[#C21807]/40"></div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Date Calendar */}
                <section className="space-y-4">
                    <div className="flex items-center gap-1.5 text-[#C21807]">
                        <CalendarIcon size={18} />
                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Select Slot</h3>
                    </div>

                    {/* Calendar Mock */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">October 2023</span>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Week Headers */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {/* Dummy padding */}
                            <span className="text-gray-200 text-xs py-1.5">25</span>
                            <span className="text-gray-200 text-xs py-1.5">26</span>
                            <span className="text-gray-200 text-xs py-1.5">27</span>

                            {calendarDays.map((cal) => {
                                const isSelected = selectedDate === Number(cal.day);
                                return (
                                    <button
                                        key={cal.day}
                                        onClick={() => setSelectedDate(Number(cal.day))}
                                        className={`text-xs py-1.5 font-semibold rounded-full flex items-center justify-center transition-all ${isSelected
                                            ? 'bg-[#C21807] text-white shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cal.day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Available Times */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} />
                            Available Hours
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {timeSlots.map((slot) => {
                                const isSelected = selectedTime === slot;
                                return (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all ${isSelected
                                            ? 'bg-[#C21807] border-transparent text-white shadow-sm'
                                            : 'bg-white border-gray-100 text-gray-700 hover:border-[#C21807]/30'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Action Button */}
                <div className="pt-4 space-y-2">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-gradient-to-r from-[#C21807] to-[#A31405] text-white text-sm font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                    >
                        Confirm Return Schedule
                        <CheckCircle size={16} />
                    </button>
                    <button
                        onClick={() => navigate('chat', activeConversationId || 'sarah')}
                        className="w-full bg-transparent border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider py-4 rounded-2xl transition-all duration-150 active:scale-[0.98]"
                    >
                        Reschedule
                    </button>
                </div>
            </div>

            {/* Full screen Success Overlay Modal */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: 'spring' }}
                            className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-6 border border-green-100 shadow-md"
                        >
                            <CheckCircle size={40} className="animate-pulse" />
                        </motion.div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Schedule Confirmed</h2>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
                            Your return appointment has been successfully scheduled and sent to <strong className="text-gray-900">Sarah J.</strong>!
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left space-y-1.5 w-full max-w-xs text-xs">
                            <p className="text-gray-500"><strong>Location:</strong> <span className="text-gray-900 font-semibold">{selectedLocation}</span></p>
                            <p className="text-gray-500"><strong>Date:</strong> <span className="text-gray-900 font-semibold">Oct {selectedDate}, 2023</span></p>
                            <p className="text-gray-500"><strong>Time slot:</strong> <span className="text-gray-900 font-semibold">{selectedTime}</span></p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
