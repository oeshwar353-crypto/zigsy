import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { Camera, ArrowLeft, Check, X, ShieldAlert, User } from 'lucide-react';
import { isUsernameTaken, addTakenUsername } from '../../utils/username';

export default function EditProfile() {
    const { profile, updateProfile, goBack } = useProfile();

    const [fullName, setFullName] = useState(profile.fullName);
    const [username, setUsername] = useState(profile.username);
    const [bio, setBio] = useState(profile.bio);
    const [collegeName, setCollegeName] = useState(profile.collegeName);
    const [gender, setGender] = useState(profile.gender);
    const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
    const [email, setEmail] = useState(profile.email);
    const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState("");

    // List of mock colleges for students to choose from
    const collegeOptions = [
        'Delhi University',
        'Fashion Institute of Technology',
        'IIT Delhi',
        'Jawaharlal Nehru University',
        'Amity University',
        'National Institute of Fashion Technology'
    ];

    // List of mock stylish avatars for user to cycle through to simulate camera upload
    const mockAvatars = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400'
    ];

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('avatar-file-input')?.click();
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        if (isUsernameTaken(username, profile.username)) {
            setError("Username is already taken. Please choose another one.");
            return;
        }
        setIsSaving(true);

        setTimeout(() => {
            updateProfile({
                fullName,
                username,
                bio,
                collegeName,
                gender,
                phoneNumber,
                email,
                profilePhoto
            });
            addTakenUsername(username);
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                goBack();
            }, 1500);
        }, 800);
    };

    return (
        <div id="edit-profile-screen" className="pb-20 max-w-lg mx-auto">
            {/* Toast Alert */}
            {showToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider animate-bounce">
                    <Check className="w-4 h-4" />
                    Changes Saved Successfully
                </div>
            )}

            {/* Profile Photo Upload Widget */}
            <section className="flex flex-col items-center mb-8">
                <input
                    type="file"
                    id="avatar-file-input"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                />
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-100 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 bg-neutral-100 flex items-center justify-center">
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt="Preview Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-12 h-12 text-neutral-400" />
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="absolute bottom-1 right-1 bg-brand-cherry text-white p-2 rounded-full shadow-lg active:scale-90 transition-all border-2 border-white"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <p className="mt-3 text-xs font-bold text-brand-cherry tracking-wide uppercase hover:opacity-70 cursor-pointer transition-opacity" onClick={triggerFileInput}>
                    Change Photo
                </p>
            </section>

            {/* Form Fields */}
            <form onSubmit={handleSaveChanges} className="space-y-5">
                {/* Full Name */}
                <div className="relative">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-cherry focus:ring-1 focus:ring-brand-cherry transition-colors shadow-xs"
                        placeholder="e.g. Om Shrivastava"
                    />
                </div>

                {/* Username */}
                <div className="relative">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                        Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            const val = e.target.value;
                            setUsername(val);
                            if (val && isUsernameTaken(val, profile.username)) {
                                setError("Username is already taken. Please choose another one.");
                            } else {
                                setError("");
                            }
                        }}
                        required
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none transition-colors shadow-xs ${
                            username && isUsernameTaken(username, profile.username)
                                ? 'border-red-500 focus:border-red-600 focus:ring-red-600'
                                : 'border-gray-200 focus:border-brand-cherry focus:ring-1 focus:ring-brand-cherry'
                        }`}
                        placeholder="e.g. om_styles"
                    />
                    {username && isUsernameTaken(username, profile.username) && (
                        <p className="text-xs text-red-500 font-semibold mt-1 ml-1">
                            Username is already taken
                        </p>
                    )}
                </div>

                {/* Bio */}
                <div className="relative">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-cherry focus:ring-1 focus:ring-brand-cherry transition-colors shadow-xs resize-none"
                        placeholder="Write a short bio about your style..."
                    />
                </div>

                {/* College Selection Dropdown */}
                <div className="relative">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                        College / University
                    </label>
                    <select
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-cherry focus:ring-1 focus:ring-brand-cherry transition-colors shadow-xs cursor-pointer appearance-none"
                    >
                        {collegeOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* Gender Choice */}
                <div className="relative">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                        Gender
                    </label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-cherry focus:ring-1 focus:ring-brand-cherry transition-colors shadow-xs cursor-pointer"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>

                {/* Contact Fields (Locked to authenticated credentials) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                            Phone Number <span className="text-[10px] text-gray-400 font-semibold lowercase">(verified)</span>
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            readOnly
                            disabled
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-text-secondary cursor-not-allowed shadow-xs"
                            placeholder="+91 99999 99999"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                            Email Address <span className="text-[10px] text-gray-400 font-semibold lowercase">(verified)</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            disabled
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-text-secondary cursor-not-allowed shadow-xs"
                            placeholder="you@email.com"
                        />
                    </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-4 bg-brand-cherry hover:bg-brand-dark text-white font-extrabold text-xs tracking-widest uppercase rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        type="button"
                        onClick={goBack}
                        className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold text-xs tracking-widest uppercase rounded-2xl transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
