/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { RentalStatus, RentalItem } from '../../types';
import { Calendar, RefreshCw, AlertCircle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function RentalHistory() {
    const { rentals, updateRentalStatus } = useProfile();
    const [activeTab, setActiveTab] = useState<RentalStatus>('upcoming');
    const [returnItem, setReturnItem] = useState<RentalItem | null>(null);

    // Filter rentals based on chosen tab status
    const filteredRentals = rentals.filter((item) => item.status === activeTab);

    const tabOptions: { key: RentalStatus; label: string }[] = [
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'active', label: 'Active' }
    ];

    const handleAction = (item: RentalItem, action: string) => {
        if (action === 'return') {
            setReturnItem(item);
        } else if (action === 'extend') {
            // Extension flow — prototype stub
        } else if (action === 'rent-again') {
            // Rent again — prototype stub
        }
    };

    return (
        <>
        <div id="rental-history-screen" className="pb-20 max-w-md mx-auto">
            {/* Scrollable Status Tabs */}
            <nav className="flex items-center justify-between border-b border-gray-100 mb-6 bg-white shrink-0">
                {tabOptions.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-3 font-bold text-[11px] tracking-wider uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer px-1 ${activeTab === tab.key
                            ? 'text-brand-cherry border-brand-cherry'
                            : 'text-text-secondary border-transparent hover:text-text-primary'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Rentals Grid */}
            {filteredRentals.length > 0 ? (
                <div className="space-y-6">
                    {filteredRentals.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-[24px] overflow-hidden border shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between overflow-hidden ${item.status === 'active' ? 'border-brand-cherry/40 ring-1 ring-brand-cherry/10' : 'border-gray-100'
                                }`}
                        >
                            {/* Image Container with Status Indicator */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                                />

                                {/* Status Badges */}
                                {item.status === 'upcoming' && (
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs border border-gray-100">
                                        <span className="font-bold text-[10px] text-brand-cherry uppercase tracking-wider">
                                            Starts in {item.startsInDays || 3} days
                                        </span>
                                    </div>
                                )}

                                {item.status === 'active' && (
                                    <div className="absolute top-4 right-4 bg-brand-cherry text-white px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                        Currently Wearing
                                    </div>
                                )}

                                {item.status === 'completed' && (
                                    <div className="absolute top-4 right-4 bg-green-50/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs border border-green-200">
                                        <span className="font-bold text-[10px] text-green-700 uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Completed
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Card Meta details */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-text-primary leading-snug">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <img
                                                    src={item.sellerAvatar}
                                                    alt={item.sellerName}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                />
                                                <span className="text-[11px] text-text-secondary font-medium">
                                                    by {item.sellerName}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-lg text-brand-cherry">₹{item.amount}</p>
                                            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">
                                                {item.status === 'completed' ? 'Paid' : 'Total'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dates indicator */}
                                    <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${item.status === 'active' ? 'bg-brand-cherry/5' : 'bg-gray-50'
                                        }`}>
                                        {item.status === 'active' ? (
                                            <Clock className="w-4 h-4 text-brand-cherry" />
                                        ) : (
                                            <Calendar className="w-4 h-4 text-text-secondary" />
                                        )}
                                        <span className={`text-xs font-bold ${item.status === 'active' ? 'text-brand-cherry' : 'text-text-primary'
                                            }`}>
                                            {item.status === 'active' ? item.endsTomorrowText || 'Ends Tomorrow' : item.dates}
                                        </span>
                                    </div>
                                </div>

                                {/* Specific Action Buttons based on status */}
                                <div className="pt-2">
                                    {item.status === 'upcoming' && (
                                        <button
                                            onClick={() => alert('Launching order timeline & tracking...')}
                                            className="w-full py-3 bg-brand-cherry hover:bg-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs transition-all active:scale-95 duration-200 cursor-pointer"
                                        >
                                            View Booking Details
                                        </button>
                                    )}

                                    {item.status === 'active' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(item, 'extend')}
                                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold text-xs tracking-wider uppercase rounded-xl transition-all active:scale-95 duration-200 cursor-pointer"
                                            >
                                                Extend
                                            </button>
                                            <button
                                                onClick={() => handleAction(item, 'return')}
                                                className="flex-1 py-3 bg-brand-cherry hover:bg-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs transition-all active:scale-95 duration-200 cursor-pointer"
                                            >
                                                Return
                                            </button>
                                        </div>
                                    )}

                                    {item.status === 'completed' && (
                                        <button
                                            onClick={() => handleAction(item, 'rent-again')}
                                            className="w-full py-3 bg-white border border-brand-cherry text-brand-cherry hover:bg-brand-cherry/5 font-bold text-xs tracking-wider uppercase rounded-xl transition-all active:scale-95 duration-200 cursor-pointer"
                                        >
                                            Rent Again
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty tab state */
                <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-text-secondary/50 mb-4">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-text-primary">No rentals in this state</h3>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        Ready to explore? Zigsy has thousands of styles available from designers like Jacquemus, Saint Laurent, and Prada!
                    </p>
                    <button
                        onClick={() => alert('Opening exploration tab...')}
                        className="mt-5 px-5 py-3 bg-brand-cherry hover:bg-brand-dark text-white font-extrabold text-xs tracking-wider uppercase rounded-xl cursor-pointer"
                    >
                        Explore Catalog
                    </button>
                </div>
            )}
        </div>

        <ConfirmModal
            open={returnItem !== null}
            title="Initiate Return"
            message={returnItem ? `Ready to return "${returnItem.name}"? This initiates the campus hand-off with the seller.` : ''}
            confirmLabel="Confirm Return"
            cancelLabel="Cancel"
            onConfirm={() => { if (returnItem) { updateRentalStatus(returnItem.id, 'completed'); } setReturnItem(null); }}
            onCancel={() => setReturnItem(null)}
        />
        </>
    );
}
