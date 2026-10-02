import React, { useState } from 'react';
import { useChat } from './context/ChatContext';
import {
    ArrowLeft,
    HeartCrack,
    AlertOctagon,
    Clock,
    CreditCard,
    CloudUpload,
    Send,
    X,
    FileImage,
    CheckCircle,
    AlertTriangle,
    HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReportIssue: React.FC = () => {
    const { submitIssue, navigate, activeConversationId } = useChat();

    const [selectedCategory, setSelectedCategory] = useState<any>('damaged');
    const [description, setDescription] = useState('');
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const categories = [
        {
            id: 'damaged',
            title: 'Outfit Damaged',
            desc: 'Stains, tears, or missing parts',
            icon: <HeartCrack size={24} className="text-[#C21807]" />,
        },
        {
            id: 'wrong',
            title: 'Wrong Outfit',
            desc: 'Size error or different item',
            icon: <AlertTriangle size={24} className="text-[#C21807]" />,
        },
        {
            id: 'late',
            title: 'Late Delivery',
            desc: 'Package missed the date',
            icon: <Clock size={24} className="text-[#C21807]" />,
        },
        {
            id: 'payment',
            title: 'Payment Issue',
            desc: 'Discrepancy or double billing',
            icon: <CreditCard size={24} className="text-[#C21807]" />,
        },
        {
            id: 'other',
            title: 'Other Support',
            desc: 'General inquiry or other issues',
            icon: <HelpCircle size={24} className="text-[#C21807]" />,
        },
    ];

    const handlePhotoUploadSimulate = () => {
        // Simulated upload of a dress tear or issue
        const mockImages = [
            'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=300',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300'
        ];
        // Grab next mock or random
        const randomImg = mockImages[uploadedPhotos.length % mockImages.length];
        setUploadedPhotos((prev) => [...prev, randomImg]);
    };

    const handleRemovePhoto = (idx: number) => {
        setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        submitIssue({
            category: selectedCategory,
            description,
            photos: uploadedPhotos,
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
                    <h1 className="text-xl font-bold text-gray-900">Report an Issue</h1>
                </div>
                <div className="text-lg font-black text-[#C21807] uppercase tracking-tighter">
                    ZIGSY
                </div>
            </header>

            {/* Main Body scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-24">
                {/* Help Description */}
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Support Center</p>
                    <p className="text-sm text-gray-500 leading-relaxed font-normal">
                        We're sorry something went wrong. Tell us more so our concierge team can fix it immediately.
                    </p>
                </div>

                {/* Categories Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">1. What happened?</h3>
                    <div className="space-y-2">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${isSelected
                                        ? 'bg-red-50/50 border-[#C21807] shadow-sm'
                                        : 'bg-white border-gray-100 text-gray-800 hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl shrink-0 ${isSelected ? 'bg-red-100/50' : 'bg-gray-50'}`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{cat.title}</h4>
                                        <p className="text-xs text-gray-500">{cat.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Description Input */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Describe the issue</h3>
                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 p-4 focus-within:ring-2 focus-within:ring-[#C21807]/20 transition-all">
                        <textarea
                            className="w-full h-32 bg-transparent border-none text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-0 resize-none leading-relaxed p-0"
                            placeholder="Please provide as much detail as possible about the issue..."
                            maxLength={500}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-4 text-[10px] text-gray-400 font-bold tracking-wider">
                            {description.length} / 500
                        </div>
                    </div>
                </section>

                {/* Media / Evidence Upload */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">3. Evidence (Optional)</h3>

                    <div
                        onClick={handlePhotoUploadSimulate}
                        className="border-2 border-dashed border-gray-200 hover:border-[#C21807]/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-red-50/5 transition-all duration-200 cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#C21807] mb-3 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                            <CloudUpload size={20} />
                        </div>
                        <p className="text-sm font-bold text-gray-900">Drop files here</p>
                        <p className="text-xs text-gray-500 mt-1">or click to browse from your device</p>
                        <p className="text-[10px] text-gray-400 mt-2">JPG, PNG or HEIC. Max 10MB per file.</p>
                    </div>

                    {/* Uploaded Previews */}
                    {uploadedPhotos.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-2">
                            {uploadedPhotos.map((photo, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                                    <img src={photo} alt="Evidence preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemovePhoto(idx);
                                        }}
                                        className="absolute top-1 right-1 bg-black/60 text-white hover:bg-[#C21807] transition-all p-1 rounded-full text-xs"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Submit Form */}
                <section className="pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!description.trim()}
                        className={`w-full py-4 rounded-2xl text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg duration-200 ${description.trim()
                            ? 'bg-gradient-to-r from-[#C21807] to-[#A31405] hover:brightness-110 shadow-red-100 active:scale-[0.98]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        Submit Report
                        <Send size={15} />
                    </button>
                    <p className="text-center text-gray-400 text-xs font-medium mt-4">
                        Our Concierge team typically responds within 2 hours.
                    </p>
                </section>
            </div>

            {/* Success Modal Overlay */}
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
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Report Submitted</h2>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                            We have successfully logged your report regarding <strong className="text-gray-900">{selectedCategory}</strong>.
                        </p>
                        <p className="text-xs text-gray-400 mt-2 max-w-xs leading-normal">
                            A support specialist has been assigned. You will receive a notification in your inbox as soon as we review the details.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
