import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40 backdrop-blur-sm px-4 pb-6"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${destructive ? "bg-red-50 text-[#C21807]" : "bg-gray-100 text-gray-600"}`}>
                                    <AlertTriangle size={18} />
                                </div>
                                <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
                            </div>
                            <button
                                onClick={onCancel}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                        </div>
                        <div className="px-5 pb-5 flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider py-3.5 rounded-2xl transition-all duration-150 active:scale-[0.98]"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-sm ${destructive ? "bg-[#C21807] hover:bg-[#A31405]" : "bg-gray-900 hover:bg-gray-700"}`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}