import { Head, Link, usePage } from '@inertiajs/react';
import React, { useContext } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, User, QrCode, Bell } from 'lucide-react';
import MobileLayout, { PullContext } from '../Layouts/MobileLayout';
import NotificationsPanel from '../Components/NotificationsPanel';
import PopupNotification from '../Components/PopupNotification';

export default function Main({ upcomingEvent, lastSession, leaderboard, currentRank, notifications = [] }) {
    const { pullDistance, isRefreshing } = useContext(PullContext);
    const { auth } = usePage().props;
    const user = auth?.user;
    const member = auth?.member;

    const [isNotifOpen, setIsNotifOpen] = React.useState(false);
    const [activePopup, setActivePopup] = React.useState(null);

    React.useEffect(() => {
        // Find if there's a tier_up or monthly_recap notification to show as popup
        const popupNotif = notifications.find(n => n.data.type === 'tier_up' || n.data.type === 'monthly_recap');
        if (popupNotif) {
            setActivePopup(popupNotif);
        }
    }, [notifications]);

    // Fallbacks
    const firstName = (member?.name || user?.name || 'Guest').split(' ')[0];
    const cp = member?.lifetime_points || 0;

    // Tier Calculation
    let currentTier = 'DIAMOND';
    let nextTier = 'Club';
    let nextTierPoints = 350;

    if (cp >= 4500) {
        currentTier = 'ACE';
        nextTier = 'Max Tier';
        nextTierPoints = cp;
    } else if (cp >= 2000) {
        currentTier = 'SPADE';
        nextTier = 'Ace';
        nextTierPoints = 4500;
    } else if (cp >= 1000) {
        currentTier = 'HEART';
        nextTier = 'Spade';
        nextTierPoints = 2000;
    } else if (cp >= 350) {
        currentTier = 'CLUB';
        nextTier = 'Heart';
        nextTierPoints = 1000;
    } else {
        currentTier = 'DIAMOND';
        nextTier = 'Club';
        nextTierPoints = 350;
    }

    const pointsToUnlock = cp >= 4500 ? 0 : nextTierPoints - cp;
    const progressPercent = cp >= 4500 ? 100 : Math.min(100, (cp / nextTierPoints) * 100);

    // Finish Suffix and Weight
    const getFinishSuffix = (num) => {
        if (!num) return '';
        const j = num % 10, k = num % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
    };

    const getFinishWeight = (num) => {
        if (num === 1) return "font-bold";
        if (num === 2 || num === 3) return "font-semibold";
        return "font-medium";
    };

    // Format Dates
    const eventDate = upcomingEvent?.event_date ? new Date(upcomingEvent.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'TBA';
    const lastSessionDate = lastSession?.result_date ? new Date(lastSession.result_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

    let tierImg = 'tier_diamond.png';
    if (currentTier === 'CLUB') tierImg = 'tier_club.png';
    else if (currentTier === 'HEART') tierImg = 'tier_heart.png';
    else if (currentTier === 'SPADE') tierImg = 'tier_spade.png';
    else if (currentTier === 'ACE') tierImg = 'tier_ace.png';

    return (
        <div className="pb-28">
            <Head title="Home - The Deuce Club" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 mt-4 relative z-20">
                <Link href="/profile" className="flex items-center space-x-4">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full shrink-0 object-cover" />
                    ) : (
                        <div className="w-16 h-16 bg-[#dfd6c5] rounded-full shrink-0"></div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-[#dfd6c5] text-lg font-medium tracking-wide">hi, {firstName}!</span>
                        <span className="text-[#dfd6c5] text-xs opacity-80 tracking-wide">welcome back to The Deuce Club</span>
                    </div>
                </Link>

                <button 
                    onClick={() => setIsNotifOpen(true)}
                    className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                </button>
            </div>



            {/* Pullable Content Area */}
            <div 
                style={{ 
                    transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : 'none',
                    transition: (isRefreshing || pullDistance === 0) ? 'transform 0.3s ease-out' : 'none'
                }}
                className="relative z-10"
            >
                {/* Diamond Member Card */}
                <div className="bg-[#080d0a] border border-white/5 rounded-[2rem] p-4 sm:p-5 mb-4 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex space-x-2 items-center">
                        <img src={`/img/${tierImg}`} alt="Tier Icon" className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl object-cover shrink-0 border border-white/5 shadow-inner" />
                        <div className="flex flex-col justify-center">
                            <span className="text-white text-[9px] sm:text-[11px] font-medium tracking-wide mb-0.5 whitespace-nowrap uppercase">{currentTier} MEMBER</span>
                            <div className="flex items-baseline space-x-1 mb-0.5">
                                <span className="text-white text-[2rem] sm:text-[2.4rem] font-medium leading-none tracking-tight">{cp}</span>
                                <span className="text-white text-lg sm:text-xl font-medium">CP</span>
                            </div>
                            <span className="text-white/70 text-[8px] sm:text-[9px] tracking-wide whitespace-nowrap">Lifetime Community Points</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-1">
                        {cp < 4500 && (
                            <div className="flex flex-col text-left mr-1">
                                <span className="text-white/80 text-[8px] sm:text-[9px] mb-1 whitespace-nowrap">{pointsToUnlock} CP to unlock</span>
                                <span className="text-white font-semibold text-[13px] sm:text-[14px] tracking-wider leading-none uppercase whitespace-nowrap">{nextTier}</span>
                            </div>
                        )}

                        <div className="flex items-center">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 border border-white/30 rounded-xl flex items-center justify-center bg-transparent shrink-0 mr-1 shadow-sm">
                                <span className="text-[#dfd6c5] text-[1.2rem] font-bold">♣</span>
                            </div>
                            <Link href="/tier" className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                                <ChevronRight size={10} strokeWidth={4} className="text-black ml-[1px]" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#323634] rounded-full h-4 mb-2 relative overflow-hidden">
                    <div className="bg-[#2a7a60] h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="text-center text-[11px] font-medium tracking-wide mt-3">
                    <span className="text-[#2a7a60]">{cp}</span>
                    <span className="text-white/60"> / {cp >= 4500 ? 'Max' : nextTierPoints} CP</span>
                </div>
            </div>

            {/* Upcoming Event */}
            <div className="bg-gradient-to-r from-[#e7dfc8] to-[#c79a4a] rounded-2xl p-4 mb-4 relative shadow-md">
                <span className="text-[#3b2d13] text-sm font-medium mb-1 block">Upcoming Event</span>
                <h3 className="text-[#1a1407] font-semibold text-lg mb-3">{upcomingEvent ? upcomingEvent.event_name : 'No Upcoming Events'}</h3>
                {upcomingEvent && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#3b2d13] text-[10px] font-medium">
                        <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{eventDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{upcomingEvent.event_time || 'TBA'}</span>
                        </div>
                        <div className="flex items-center space-x-1 w-full mt-1">
                            <MapPin size={12} />
                            <span>{upcomingEvent.location}</span>
                        </div>
                    </div>
                )}
                <Link href={upcomingEvent ? `/events/${upcomingEvent.event_id}` : '/events'} className="absolute bottom-4 right-4 bg-[#1a1407] text-[#e7dfc8] text-[9px] px-3 py-1.5 rounded-full flex items-center space-x-1">
                    <span>view details</span>
                    <ChevronRight size={10} />
                </Link>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-5 gap-3 mb-4">
                {/* Last Session */}
                {lastSession ? (
                    <Link href={`/events/${lastSession.event_id}`} className="col-span-3 bg-[#0b120f] border border-white/5 rounded-2xl p-4 relative shadow-md flex flex-col justify-between min-h-[170px]">
                        <span className="text-[#dfd6c5] text-[13px] font-medium mb-3">Last Session Result</span>
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex items-center space-x-3 mb-4 mt-1">
                                <img src={
                                    lastSession.finish === 1 ? '/img/gold.png' :
                                        lastSession.finish === 2 ? '/img/silver2.png' :
                                            lastSession.finish === 3 ? '/img/bronze.png' :
                                                '/img/black.png'
                                } alt="Rank Medal" className="w-16 h-16 object-contain shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[#dfd6c5] text-[10px] opacity-80">you finished</span>
                                    <span className={`text-[#dfd6c5] text-xl leading-tight ${getFinishWeight(lastSession.finish)}`}>
                                        <span className="text-[#b57a4c]">{lastSession.finish}</span><sup className="text-[10px] ml-[1px]">{getFinishSuffix(lastSession.finish)}</sup> Place
                                    </span>
                                    <span className="text-[#dfd6c5] text-[10px] opacity-80 mt-0.5">of {lastSession.total_players || lastSession.attendance || '-'} players</span>
                                </div>
                            </div>
                            <div className="bg-[#1a2d24] rounded-xl p-2.5 flex justify-between items-center w-full">
                                <div className="flex flex-col">
                                    <span className="text-[#4cd3a4] text-xs font-semibold">+{lastSession.placement_bonus || 0} CP <span className="font-normal text-[#dfd6c5] ml-0.5">Earned</span></span>
                                    <span className="text-[#dfd6c5] text-[9px] opacity-60 mt-0.5">{lastSessionDate}</span>
                                </div>
                                <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <ChevronRight size={10} className="text-[#dfd6c5]" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="col-span-3 bg-[#0b120f] border border-white/5 rounded-2xl p-4 relative shadow-md flex flex-col justify-between min-h-[170px]">
                        <span className="text-[#dfd6c5] text-[13px] font-medium mb-3">Last Session Result</span>
                        <div className="flex items-center justify-center h-full">
                            <span className="text-[#dfd6c5] text-xs opacity-60">No recent sessions</span>
                        </div>
                    </div>
                )}

                {/* League */}
                <div className="col-span-2 bg-gradient-to-br from-[#2a0e0e] via-[#1c0808] to-[#0a0404] rounded-2xl p-4 relative shadow-md flex flex-col items-center justify-center text-center min-h-[170px]">
                    <span className="absolute top-4 left-4 text-[#dfd6c5] text-[13px] font-medium">League</span>
                    <div className="absolute top-4 right-4 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                        <ChevronRight size={12} className="text-[#dfd6c5]" />
                    </div>

                    <div className="flex flex-col mt-4">
                        <span className="text-[#dfd6c5] text-[11px] opacity-80">coming soon</span>
                        <span className="text-[#dfd6c5] text-xs font-semibold mt-0.5">October 2026</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <Link href="/check-in" className="bg-[#0c0f0e] border border-white/5 text-[#dfd6c5] text-sm font-medium py-4 rounded-xl shadow-md text-center flex items-center justify-center">
                    Check In
                </Link>
                <Link href="/history" className="bg-[#0c0f0e] border border-white/5 text-[#dfd6c5] text-sm font-medium py-4 rounded-xl shadow-md text-center flex items-center justify-center">
                    My History
                </Link>
            </div>

            {/* Monthly Leaderboard */}
            <div className="bg-[#0c1410] border border-white/5 rounded-2xl p-5 relative shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[#dfd6c5] text-sm font-medium">Monthly Leaderboard</span>
                    <Link href="/leaderboard" className="text-[#dfd6c5] text-[10px] flex items-center space-x-1 opacity-80">
                        <span>view all</span>
                        <ChevronRight size={10} />
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-6 relative">
                    {/* Vertical Divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -ml-px"></div>

                    {/* Your Rank */}
                    <div className="flex flex-col items-center justify-center w-1/2 pr-4">
                        <span className="text-[#b57a4c] text-5xl font-bold leading-none tracking-tight opacity-90 -mt-2">#{currentRank || '-'}</span>
                        <span className="text-[#dfd6c5] text-[11px] opacity-80 mt-2 font-medium">your current rank</span>
                    </div>

                    {/* Top 3 List */}
                    <div className="flex flex-col space-y-3 w-1/2 pl-6">
                        {leaderboard && leaderboard.map((l_member, index) => {
                            const colors = ['#d4af37', '#c0c0c0', '#cd7f32'];
                            return (
                                <Link href={`/profile/${l_member.member_id}`} key={l_member.member_id} className="flex items-center justify-between text-[#dfd6c5] text-[11px] w-full">
                                    <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
                                        <span style={{ color: colors[index] || '#ffffff' }} className="font-bold text-[10px] shrink-0">♣</span>
                                        {l_member.user?.avatar ? (
                                            <img src={l_member.user.avatar} className="w-4 h-4 rounded-full shrink-0" alt="avatar" />
                                        ) : (
                                            <div className="w-4 h-4 bg-[#dfd6c5] rounded-full shrink-0"></div>
                                        )}
                                        <span className="truncate">{l_member.name.split(' ')[0]}</span>
                                    </div>
                                    <span className="font-semibold shrink-0">{l_member.monthly_points} <span className="text-[9px] font-normal opacity-70">CP</span></span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Alert Bar Inside Leaderboard */}
                {currentRank && (
                    <div className="bg-[#247c64] text-white text-[11px] font-medium py-3 px-4 rounded-xl text-center shadow-inner w-full mt-2">
                        Keep playing to improve your rank 🔥
                    </div>
                )}
            </div>
            
            </div> {/* End of Pullable Content Area */}

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-8 mb-20 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>

            <NotificationsPanel 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)} 
                notifications={notifications} 
            />

            <PopupNotification 
                notification={activePopup} 
                onClose={() => setActivePopup(null)} 
            />
        </div>
    );
}

Main.layout = page => <MainLayout>{page}</MainLayout>;

const MainLayout = ({ children }) => {
    return <MobileLayout customTranslate={true}>{children}</MobileLayout>;
};
