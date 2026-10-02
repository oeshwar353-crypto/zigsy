/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { Address, AddressType } from '../../types';
import { MapPin, Plus, Edit2, Trash2, Home, Landmark, Building, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function SavedAddresses() {
    const { addresses, addAddress, editAddress, deleteAddress, setDefaultAddress } = useProfile();
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form Fields State
    const [label, setLabel] = useState('');
    const [type, setType] = useState<AddressType>('Hostel');
    const [detail, setDetail] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const resetForm = () => {
        setLabel('');
        setType('Hostel');
        setDetail('');
        setIsDefault(false);
        setEditingId(null);
        setIsEditing(false);
    };

    const handleEditClick = (addr: Address) => {
        setEditingId(addr.id);
        setLabel(addr.label);
        setType(addr.type);
        setDetail(addr.detail);
        setIsDefault(addr.isDefault);
        setIsEditing(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            editAddress(editingId, { label, type, detail, isDefault });
        } else {
            addAddress({ label, type, detail, isDefault });
        }
        resetForm();
    };

    const getTypeIcon = (addrType: AddressType) => {
        switch (addrType) {
            case 'Hostel':
                return <Landmark className="w-5 h-5" />;
            case 'Home':
                return <Home className="w-5 h-5" />;
            case 'Apartment':
                return <Building className="w-5 h-5" />;
            default:
                return <MapPin className="w-5 h-5" />;
        }
    };

    return (
        <>
        <div id="saved-addresses-screen" className="pb-20 max-w-lg mx-auto">
            {/* Form or List toggle */}
            {isEditing ? (
                <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                    <h3 className="font-bold text-base text-text-primary mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-brand-cherry" />
                        {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                Address Nickname
                            </label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                                placeholder="e.g. DU Hostel, My Room, Parents' Home"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                Location Type
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['Hostel', 'Home', 'Apartment', 'Other'] as AddressType[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${type === t
                                            ? 'bg-brand-cherry border-brand-cherry text-white'
                                            : 'bg-white border-gray-200 text-text-secondary hover:bg-gray-50'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                Complete Delivery Details
                            </label>
                            <textarea
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                required
                                rows={3}
                                placeholder="Room number, hostel name, building details, street name, pincode..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry transition-all resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-2.5 pt-1">
                            <input
                                type="checkbox"
                                id="default-chk"
                                checked={isDefault}
                                onChange={(e) => setIsDefault(e.target.checked)}
                                className="w-4 h-4 rounded text-brand-cherry focus:ring-brand-cherry cursor-pointer"
                            />
                            <label htmlFor="default-chk" className="text-xs font-bold text-text-primary cursor-pointer select-none">
                                Set as Default Address
                            </label>
                        </div>

                        <div className="flex gap-2.5 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-3.5 bg-brand-cherry hover:bg-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold text-xs tracking-wider uppercase rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <section className="space-y-6">
                    {/* Quick Trigger to Add */}
                    <button
                        id="add-address-trigger"
                        onClick={() => {
                            setEditingId(null);
                            setIsEditing(true);
                        }}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm text-text-primary">Add New Address</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* List of existing locations */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">
                            Saved Locations
                        </h3>

                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="p-4 flex flex-col transition-colors hover:bg-gray-50/20">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${addr.isDefault ? 'bg-brand-cherry/10 text-brand-cherry' : 'bg-gray-100 text-text-secondary'
                                                }`}>
                                                {getTypeIcon(addr.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm text-text-primary">{addr.label}</h4>
                                                    {addr.isDefault && (
                                                        <span className="bg-brand-cherry/10 text-brand-cherry text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-sm">
                                                    {addr.detail}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick controls */}
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleEditClick(addr)}
                                                title="Edit"
                                                className="p-1.5 rounded-full text-text-secondary hover:text-brand-cherry hover:bg-gray-100 transition-all cursor-pointer"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTargetId(addr.id)}
                                                title="Delete"
                                                className="p-1.5 rounded-full text-text-secondary hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions for default toggle */}
                                    {!addr.isDefault && (
                                        <div className="pl-12 pt-2">
                                            <button
                                                onClick={() => setDefaultAddress(addr.id)}
                                                className="text-[10px] font-bold text-brand-cherry uppercase tracking-wider hover:underline cursor-pointer"
                                            >
                                                Set as Default
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aesthetic Neighborhood Hero Map Image */}
                    <div className="relative rounded-3xl overflow-hidden h-40 shadow-xs border border-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=600"
                            alt="Golden hour neighborhood scenery"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent flex flex-col justify-end p-4">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Premium Logistics</span>
                            <h4 className="font-bold text-lg text-white">Hand-delivered to your door.</h4>
                        </div>
                    </div>
                </section>
            )}
        </div>

        <ConfirmModal
            open={deleteTargetId !== null}
            title="Delete Address"
            message="Are you sure you want to delete this address? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            destructive
            onConfirm={() => { if (deleteTargetId) deleteAddress(deleteTargetId); setDeleteTargetId(null); }}
            onCancel={() => setDeleteTargetId(null)}
        />
        </>
    );
}
