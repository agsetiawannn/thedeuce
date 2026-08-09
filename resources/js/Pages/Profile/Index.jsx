import React, { useState, useRef } from 'react';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { Settings, LogOut, ChevronRight, Edit2, Camera, X } from 'lucide-react';

export default function Profile({ sessionJoined, currentRank, totalWins, totalLosses, winRate }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const member = auth?.member;

    const name = member?.name || user?.name || 'Guest User';
    const email = member?.email || user?.email || '-';
    const phone = member?.phone_number || '-';
    const joinDate = member?.join_date ? new Date(member.join_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
    const cp = member?.lifetime_points || 0;
    
    let currentTier = 'DIAMOND';
    if (cp >= 4500) currentTier = 'ACE';
    else if (cp >= 2000) currentTier = 'SPADE';
    else if (cp >= 1000) currentTier = 'HEART';
    else if (cp >= 350) currentTier = 'CLUB';

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(user?.avatar || null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: name !== 'Guest User' ? name : '',
        avatar: null,
    });

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        reset();
        setPreviewImage(user?.avatar || null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submitEdit = (e) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    return (
        <div className="flex flex-col min-h-screen w-full relative pb-28">
            <Head title="Profile - The Deuce Club" />

            {/* Header */}
            <div className="pt-4 mb-6">
                <h1 className="text-white text-xl font-medium">Profile</h1>
            </div>

            <div className="flex flex-col">
                {/* User Profile Card */}
                <div className="bg-[#0c1410] border border-white/5 rounded-2xl p-5 mb-4 shadow-lg relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            {user?.avatar ? (
                                <img src={user?.avatar} alt="Profile" className="w-16 h-16 rounded-full shrink-0 object-cover" />
                            ) : (
                                <div className="w-16 h-16 bg-[#dfd6c5] rounded-full shrink-0"></div>
                            )}
                            <div className="flex flex-col space-y-0.5 max-w-[150px]">
                                <span className="text-white font-medium text-[15px] truncate">{name}</span>
                                <span className="text-[#dfd6c5] opacity-80 text-[11px] truncate">{phone}</span>
                                <span className="text-[#dfd6c5] opacity-80 text-[11px] truncate">{email}</span>
                            </div>
                        </div>
                        <button onClick={openEditModal} className="border border-white/30 text-white/70 hover:bg-white/10 transition-colors text-[9px] px-2 py-0.5 rounded flex items-center shrink-0">
                            edit profile
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-end mt-6">
                        <div className="flex flex-col">
                            <span className="text-[#dfd6c5] opacity-80 text-[10px]">Join Date:</span>
                            <span className="text-[#dfd6c5] opacity-80 text-[10px]">{joinDate}</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-1.5 text-[#dfd6c5] opacity-80 uppercase tracking-widest text-[10px]">
                            <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                            <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                            <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                        </div>
                    </div>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Community Points */}
                    <div className="bg-gradient-to-b from-[#0e1d17] to-[#08120e] border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-md min-h-[130px]">
                        <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90">Community Points</span>
                        <div className="flex items-baseline space-x-1 mt-auto pb-4">
                            <span className="text-[#dfd6c5] text-4xl font-medium">{cp}</span>
                            <span className="text-[#dfd6c5] text-lg">CP</span>
                        </div>
                    </div>

                    {/* Tier */}
                    <div className="bg-gradient-to-b from-[#0e1d17] to-[#08120e] border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-md min-h-[130px]">
                        <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90">Tier</span>
                        <div className="mt-auto pb-4">
                            <span className="text-[#dfd6c5] text-xl font-medium">{currentTier}</span>
                        </div>
                    </div>

                    {/* Session Joined */}
                    <div className="bg-gradient-to-b from-[#0e1d17] to-[#08120e] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md min-h-[130px] relative">
                        <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90 absolute top-4 left-4">Session Joined</span>
                        <span className="text-[#dfd6c5] text-4xl font-medium mt-6">{sessionJoined || 0}</span>
                        <span className="text-[#dfd6c5] text-[10px] mt-1">Session (s)</span>
                    </div>

                    {/* Monthly Leaderboard */}
                    <div className="bg-gradient-to-b from-[#0e1d17] to-[#08120e] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md min-h-[130px] relative">
                        <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90 absolute top-4 left-4">Monthly Leaderboard</span>
                        <span className="text-[#dfd6c5] text-4xl font-medium mt-6">#{currentRank || '-'}</span>
                    </div>
                </div>

                {/* Overall Stats */}
                <div className="bg-gradient-to-b from-[#0e1d17] to-[#08120e] border border-white/5 rounded-2xl p-5 shadow-lg relative flex flex-col min-h-[140px] mb-4">
                    <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90 mb-6">Overall Stats</span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="flex flex-col items-center justify-center border-r border-white/5">
                            <span className="text-[#dfd6c5] text-2xl font-medium">{totalWins}</span>
                            <span className="text-white/50 text-[9px] uppercase tracking-wider mt-1 font-medium">Total Wins</span>
                        </div>
                        <div className="flex flex-col items-center justify-center border-r border-white/5">
                            <span className="text-[#dfd6c5] text-2xl font-medium">{totalLosses}</span>
                            <span className="text-white/50 text-[9px] uppercase tracking-wider mt-1 font-medium">Total Losses</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[#dfd6c5] text-2xl font-medium">{winRate}%</span>
                            <span className="text-white/50 text-[9px] uppercase tracking-wider mt-1 font-medium">Win Rate</span>
                        </div>
                    </div>
                </div>

                {/* League Stats */}
                <div className="bg-gradient-to-br from-[#120808] via-[#2c0f0f] to-[#5a1b1b] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[140px] mb-6">
                    <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90">League Stats</span>
                    <div className="flex flex-col items-center justify-center flex-1 h-full pt-4">
                        <span className="text-[#dfd6c5] text-[12px] opacity-80 uppercase tracking-widest font-semibold">coming soon</span>
                        <span className="text-[#dfd6c5] text-[10px] opacity-60 mt-1">October 2026</span>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-2 mb-2">
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button"
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3.5 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
                    >
                        <LogOut size={16} />
                        <span className="text-sm">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-4 mb-4 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#111a15] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative">
                        <button onClick={closeEditModal} className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 p-1 rounded-full transition-colors z-10">
                            <X size={18} />
                        </button>

                        <div className="p-6 pb-2 border-b border-white/5">
                            <h2 className="text-white text-lg font-semibold">Edit Profile</h2>
                            <p className="text-[#dfd6c5] text-xs opacity-70 mt-1">Update your personal information</p>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <form onSubmit={submitEdit} className="flex flex-col space-y-5">
                                
                                {/* Photo Upload */}
                                <div className="flex flex-col items-center justify-center mb-2">
                                    <div 
                                        className="w-24 h-24 rounded-full border border-white/10 relative overflow-hidden bg-black/40 group cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full bg-[#dfd6c5]/20"></div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <span className="text-[#dfd6c5] text-[10px] mt-3 opacity-60">Tap to change photo</span>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden" 
                                    />
                                    {errors.avatar && <span className="text-red-400 text-[10px] mt-1">{errors.avatar}</span>}
                                </div>

                                {/* Name Field */}
                                <div className="flex flex-col space-y-1.5">
                                    <label className="text-[#dfd6c5] text-xs opacity-80">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="bg-[#050907] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#247c64] transition-colors"
                                        placeholder="Your full name"
                                    />
                                    {errors.name && <span className="text-red-400 text-[10px]">{errors.name}</span>}
                                </div>

                            </form>
                        </div>
                        
                        <div className="p-6 pt-4 border-t border-white/5 bg-[#0a0f0d]">
                            <button 
                                onClick={submitEdit}
                                disabled={processing}
                                className="w-full bg-[#dfd6c5] text-black font-semibold text-sm py-3.5 rounded-xl shadow-lg shadow-white/5 hover:bg-white transition-colors flex justify-center items-center"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Nav */}
        </div>
    );
}
