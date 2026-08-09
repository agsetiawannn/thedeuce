import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function ProfileShow({ member, sessionJoined, currentRank, totalWins, totalLosses, winRate }) {
    const user = member?.user;

    const name = member?.name || user?.name || 'Guest User';
    const joinDate = member?.join_date ? new Date(member.join_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
    const cp = member?.lifetime_points || 0;
    
    let currentTier = 'DIAMOND';
    if (cp >= 4500) currentTier = 'ACE';
    else if (cp >= 2000) currentTier = 'SPADE';
    else if (cp >= 1000) currentTier = 'HEART';
    else if (cp >= 350) currentTier = 'CLUB';

    return (
        <div className="flex flex-col min-h-full h-full w-full relative pb-8">
            <Head title={`${name}'s Profile - The Deuce Club`} />

            {/* Header */}
            <div className="flex items-center space-x-3 pt-4 mb-6">
                <Link href="/" className="w-8 h-8 bg-[#dfd6c5] text-[#1b2622] rounded-full flex items-center justify-center shrink-0">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </Link>
                <h1 className="text-white text-xl font-medium">Player Profile</h1>
            </div>

            <div className="flex flex-col pb-28">
                {/* User Profile Card */}
                <div className="bg-[#0c1410] border border-white/5 rounded-2xl p-5 mb-4 shadow-lg relative overflow-hidden">
                    <div className="flex items-center space-x-4">
                        {user?.avatar ? (
                            <img src={user?.avatar} alt="Profile" className="w-16 h-16 rounded-full shrink-0 object-cover" />
                        ) : (
                            <div className="w-16 h-16 bg-[#dfd6c5] rounded-full shrink-0"></div>
                        )}
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-white font-medium text-[15px]">{name}</span>
                        </div>
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
                <div className="bg-gradient-to-br from-[#120808] via-[#2c0f0f] to-[#5a1b1b] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                    <span className="text-[#dfd6c5] text-[11px] font-medium opacity-90">League Stats</span>
                    <div className="flex flex-col items-center justify-center flex-1 h-full pt-4">
                        <span className="text-[#dfd6c5] text-[12px] opacity-80 uppercase tracking-widest font-semibold">coming soon</span>
                        <span className="text-[#dfd6c5] text-[10px] opacity-60 mt-1">October 2026</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
