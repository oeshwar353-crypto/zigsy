/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { Review } from '../../types';
import { Star, MessageSquare, Plus, Check } from 'lucide-react';

export default function Reviews() {
    const { reviews, addReview } = useProfile();
    const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
    const [isAdding, setIsAdding] = useState(false);

    // Form states for creating a new review
    const [targetUser, setTargetUser] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [reviewRole, setReviewRole] = useState<'received' | 'given'>('given');

    const filteredReviews = reviews.filter((r) => r.type === activeTab);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUser || !reviewText) return;

        addReview({
            authorName: targetUser,
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // placeholder stylish profile
            rating,
            text: reviewText,
            type: reviewRole
        });

        // Reset Form
        setTargetUser('');
        setRating(5);
        setReviewText('');
        setIsAdding(false);
        alert('Thank you! Your rating and feedback have been successfully saved!');
    };

    return (
        <div id="reviews-screen" className="pb-20 max-w-lg mx-auto">
            {isAdding ? (
                <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                    <h3 className="font-bold text-base text-text-primary mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-brand-cherry" />
                        Submit Rating &amp; Review
                    </h3>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                You are rating as a:
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setReviewRole('given')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${reviewRole === 'given'
                                        ? 'bg-brand-cherry text-white border-brand-cherry'
                                        : 'bg-white border-gray-200 text-text-secondary hover:bg-gray-50'
                                        }`}
                                >
                                    Buyer (Rate Seller)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setReviewRole('received')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${reviewRole === 'received'
                                        ? 'bg-brand-cherry text-white border-brand-cherry'
                                        : 'bg-white border-gray-200 text-text-secondary hover:bg-gray-50'
                                        }`}
                                >
                                    Seller (Rate Buyer)
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                Student Name / Username
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Elena V. or @elena_closet"
                                value={targetUser}
                                onChange={(e) => setTargetUser(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                Rating
                            </label>
                            <div className="flex gap-1.5 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="cursor-pointer text-accent-gold transition-transform hover:scale-110"
                                    >
                                        <Star className={`w-7 h-7 ${star <= rating ? 'fill-current' : 'text-gray-300'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                Written Feedback
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Describe your hand-off experience, garment condition, and communication..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry resize-none"
                            />
                        </div>

                        <div className="flex gap-2.5 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-3.5 bg-brand-cherry hover:bg-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs cursor-pointer"
                            >
                                Submit Review
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold text-xs tracking-wider uppercase rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <section className="space-y-6">
                    {/* Ratings Summary Header Card */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-1">
                                <span className="text-3xl font-extrabold text-text-primary">4.9</span>
                                <span className="text-sm font-semibold text-text-secondary self-end mb-1">/5</span>
                            </div>
                            <div className="flex gap-0.5 text-accent-gold mt-1.5 justify-center md:justify-start">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                                <Star className="w-4 h-4 fill-current opacity-85" />
                            </div>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-2">
                                Based on 124 Reviews
                            </p>
                        </div>

                        <button
                            id="submit-review-trigger"
                            onClick={() => setIsAdding(true)}
                            className="bg-brand-cherry hover:bg-brand-dark text-white px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-sm active:scale-95 duration-150 transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Rate User
                        </button>
                    </div>

                    {/* Tab Nav */}
                    <div className="border-b border-gray-100 flex justify-between items-center bg-surface-bg sticky top-14 z-10">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setActiveTab('received')}
                                className={`pb-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${activeTab === 'received'
                                    ? 'text-brand-cherry border-brand-cherry'
                                    : 'text-text-secondary border-transparent hover:text-text-primary'
                                    }`}
                            >
                                Reviews Received
                            </button>
                            <button
                                onClick={() => setActiveTab('given')}
                                className={`pb-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${activeTab === 'given'
                                    ? 'text-brand-cherry border-brand-cherry'
                                    : 'text-text-secondary border-transparent hover:text-text-primary'
                                    }`}
                            >
                                Reviews Given
                            </button>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((rev) => (
                                <div
                                    key={rev.id}
                                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3 items-center">
                                            <img
                                                src={rev.authorAvatar}
                                                alt={rev.authorName}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-cherry/5"
                                            />
                                            <div>
                                                <h4 className="font-bold text-sm text-text-primary">{rev.authorName}</h4>
                                                <p className="text-[10px] text-text-secondary font-medium">{rev.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-0.5 text-accent-gold">
                                            {Array.from({ length: rev.rating }).map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-xs text-text-primary leading-relaxed">
                                        {rev.text}
                                    </p>

                                    {/* Optional Review Images attachments */}
                                    {rev.imageUrls && rev.imageUrls.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {rev.imageUrls.map((img, idx) => (
                                                <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                                    <img src={img} alt="attached style" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-6">
                                <MessageSquare className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
                                <p className="text-sm font-bold text-text-primary">No feedback yet</p>
                                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                                    Rentals completed under this account will have their hand-off reviews posted here.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
