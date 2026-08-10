import React, { forwardRef } from 'react';
import { logoGroup35, logoFull } from './ImageAssets';

// Get suffix for placement (1st, 2nd, 3rd, 4th, etc)
const getSuffix = (i) => {
    let j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
};

// Design exact replica of the user's screenshot
const SessionResultGraphic = forwardRef(({ 
    layout = 1,
    eventName = '',
    placement = '',
    wins = 0, 
    losses = 0, 
    winRate = 0, 
    pointsEarned = 0, 
    tier = 'CLUB', 
    date = '', 
    location = '' 
}, ref) => {
    
    if (layout === 2) {
        return (
            <div 
                ref={ref}
                className="w-[1080px] h-[1920px] min-w-[1080px] min-h-[1920px] bg-transparent relative flex flex-col overflow-hidden justify-center items-center"
                style={{ 
                    fontFamily: "'42dot Sans', sans-serif"
                }}
            >
                <div className="flex flex-col w-full px-[140px]">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-6 mb-28 w-full">
                        <img src={logoGroup35} alt="Logo" className="w-[85px] h-auto object-contain" />
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }} className="text-[#e7ddc6] text-[54px] tracking-wide mt-2">THE DEUCE CLUB</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-y-24 gap-x-8 w-full text-white">
                        {/* Row 1 */}
                        <div className="flex flex-col items-start text-left col-span-1">
                            <span className="text-[#a1a1aa] text-[32px] font-normal tracking-wide mb-1">Result</span>
                            <span className="text-[#e7ddc6] text-[80px] font-bold leading-none tracking-tight">{wins}W {losses}L</span>
                        </div>
                        <div className="flex flex-col items-start text-left col-span-1">
                            <span className="text-[#a1a1aa] text-[32px] font-normal tracking-wide mb-1">Placement</span>
                            <div className="flex items-start">
                                <span className="text-[#e7ddc6] text-[80px] font-bold leading-none tracking-tight">{placement || '-'}</span>
                                {placement && <span className="text-[#e7ddc6] text-[44px] font-bold leading-none mt-1 ml-1">{getSuffix(placement)}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col items-start text-left col-span-1">
                            <span className="text-[#a1a1aa] text-[32px] font-normal tracking-wide mb-1">Win Rate</span>
                            <span className="text-[#e7ddc6] text-[80px] font-bold leading-none tracking-tight">{winRate}%</span>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col items-start text-left col-span-1">
                            <span className="text-[#a1a1aa] text-[32px] font-normal tracking-wide mb-1">Points Earned</span>
                            <span className="text-[#e7ddc6] text-[80px] font-bold leading-none tracking-tight">{pointsEarned}CP</span>
                        </div>
                        <div className="flex flex-col items-start text-left col-span-2">
                            <span className="text-[#a1a1aa] text-[32px] font-normal tracking-wide mb-1">Current Tier</span>
                            <span className="text-[#e7ddc6] text-[80px] font-bold leading-none tracking-widest">{tier.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={ref}
            className="w-[1080px] h-[1920px] min-w-[1080px] min-h-[1920px] bg-transparent relative flex flex-col overflow-hidden font-semibold justify-center items-center"
            style={{ 
                fontFamily: "'42dot Sans', sans-serif"
            }}
        >
            <div className="relative z-10 flex flex-col w-full h-full p-16 justify-center items-center">
                
                {/* Top: Event Info */}
                <div className="flex flex-col items-center text-center text-[#dfd6c5] shrink-0 mb-12 mt-4 w-full">
                    <div className="text-[36px] tracking-wide mb-2 opacity-90">{eventName || '[Event Name]'}</div>
                    <div className="text-[28px] tracking-wide text-white/70">{date || '[Event Date]'} | {location || '[Event Venue]'}</div>
                </div>

                {/* Middle Content */}
                <div className="flex justify-center w-full shrink-0 my-8">
                    <div className="flex items-center justify-center space-x-[80px]">
                        
                        {/* Left Side (Wins/Losses) */}
                        <div className="relative flex items-center justify-center shrink-0 w-[420px] h-[420px]">
                            <div className="relative w-[420px] h-[420px]">
                                {/* Diagonal line */}
                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/80 transform -translate-y-1/2 rotate-[-30deg]"></div>
                                
                                {/* Wins */}
                                <div className="absolute top-[20px] left-[-10px] flex items-baseline">
                                    <span className="text-[170px] text-[#dfd6c5] leading-none tracking-tighter">{wins}</span>
                                    <span className="text-[36px] text-[#dfd6c5] ml-4 tracking-wide">Wins</span>
                                </div>

                                {/* Losses */}
                                <div className="absolute bottom-[20px] right-[-10px] flex items-baseline">
                                    <span className="text-[170px] text-[#dfd6c5] leading-none tracking-tighter">{losses}</span>
                                    <span className="text-[36px] text-[#dfd6c5] ml-4 tracking-wide">Losses</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side (Stats) */}
                        <div className="flex flex-col justify-between py-6 space-y-12 shrink-0 w-[320px]">
                            <div className="flex flex-col">
                                <span className="text-[24px] text-white/70 mb-1">Placement</span>
                                <div className="flex items-baseline">
                                    <span className="text-[72px] text-[#dfd6c5] leading-none">{placement || '-'}</span>
                                    {placement && <span className="text-[36px] text-[#dfd6c5] ml-2">{getSuffix(placement)}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[24px] text-white/70 mb-1">Win Rate</span>
                                <span className="text-[72px] text-[#dfd6c5] leading-none tracking-tight">{winRate}%</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[24px] text-white/70 mb-1">Points Earned</span>
                                <span className="text-[72px] text-[#dfd6c5] leading-none tracking-tight">{pointsEarned > 0 ? `+${pointsEarned}` : pointsEarned}CP</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[24px] text-white/70 mb-1">Current Tier</span>
                                <span className="text-[64px] text-[#dfd6c5] leading-none tracking-wide">{tier}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Logo */}
                <div className="flex justify-center w-full shrink-0 mt-8 mb-4">
                    <img src={logoFull} alt="Logo" style={{ width: '380px', height: '380px', objectFit: 'contain', opacity: 0.9 }} />
                </div>
                
            </div>
        </div>
    );
});

export default SessionResultGraphic;
