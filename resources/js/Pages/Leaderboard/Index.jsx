import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function LeaderboardIndex({ leaderboard }) {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

    const getFinishSuffix = (num) => {
        if (!num) return '';
        const j = num % 10, k = num % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
    };

    const getRankColor = (rank) => {
        if (rank === 1) return '#d4af37'; // gold
        if (rank === 2) return '#c0c0c0'; // silver
        if (rank === 3) return '#cd7f32'; // bronze
        return '#dfd6c5'; // default
    };

    return (
        <div className="w-full max-w-[430px] mx-auto min-h-[100dvh] h-[100dvh] bg-cover bg-center bg-no-repeat flex flex-col relative overflow-hidden" style={{ backgroundImage: `url('/img/bg.png')` }}>
            {/* Smooth transition from the black gap at the top */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col flex-1 w-full h-full px-5 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <Head title="Monthly Leaderboard - The Deuce Club" />

                {/* Header */}
                <div className="flex items-start mb-4 mt-2 shrink-0">
                    <Link href="/" className="w-8 h-8 bg-white/5 text-white rounded-full flex items-center justify-center shrink-0 border border-white/10 hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </Link>
                </div>

                {/* Title */}
                <div className="flex items-start justify-between mb-4 shrink-0">
                    <h1 className="text-white text-3xl font-light leading-tight tracking-tight flex flex-col">
                        <span>monthly</span>
                        <span className="pl-4">leaderboard</span>
                    </h1>
                    <span className="text-[#dfd6c5] text-[10px] font-semibold tracking-widest uppercase mt-3 shrink-0 text-right whitespace-nowrap">
                        [{currentMonth.replace(' ', ' - ')}]
                    </span>
                </div>

                {/* List Container */}
                <div className="bg-[#050907]/60 backdrop-blur-md rounded-3xl p-5 shadow-2xl flex-1 mb-24 border border-white/5 overflow-hidden flex flex-col">
                    <div className="flex-1 pr-2 pb-2 overflow-y-auto">
                        <div className="flex flex-col space-y-5">
                            {leaderboard && leaderboard.map((member, index) => {
                                const rank = index + 1;
                                const isTop3 = rank <= 3;
                                const color = getRankColor(rank);

                                return (
                                    <Link href={`/profile/${member.member_id}`} key={member.member_id} className="flex items-center justify-between text-white text-sm w-full">
                                        <div className="flex items-center space-x-4 flex-1 min-w-0 pr-2">
                                            {isTop3 ? (
                                                <span className="text-sm font-bold w-6 text-left shrink-0" style={{ color }}>♣</span>
                                            ) : (
                                                <span className="text-[#dfd6c5] text-xs w-6 text-left opacity-80 flex items-start shrink-0">
                                                    {rank}<span className="text-[9px] mt-0.5">{getFinishSuffix(rank)}</span>
                                                </span>
                                            )}

                                            {member.user?.avatar ? (
                                                <img src={member.user.avatar} alt={member.name} className={`w-6 h-6 rounded-full shrink-0 object-cover ${!isTop3 ? 'opacity-80 grayscale-[30%]' : ''}`} />
                                            ) : (
                                                <div className={`w-6 h-6 bg-[#dfd6c5] rounded-full shrink-0 ${!isTop3 ? 'opacity-80' : ''}`}></div>
                                            )}

                                            <span className={`text-[15px] truncate ${isTop3 ? 'font-normal' : 'font-light opacity-90'}`}>
                                                {member.name.split(' ')[0]}
                                            </span>
                                        </div>
                                        <span className={`text-[15px] shrink-0 ${isTop3 ? 'font-normal' : 'font-light text-[#dfd6c5]'}`}>
                                            {member.monthly_points} <span className="text-xs opacity-70">CP</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] absolute bottom-24 left-6 opacity-80 shrink-0 uppercase tracking-widest text-[10px]">
                    <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                    <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                    <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                    <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
                </div>
                
            </div>
        </div>
    );
}

LeaderboardIndex.layout = page => <div className="min-h-[100dvh] bg-black flex items-center justify-center">{page}</div>;
