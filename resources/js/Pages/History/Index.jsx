import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function HistoryIndex({ history }) {
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

    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredHistory = history ? history.filter(result => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const eventName = (result.event?.event_name || '').toLowerCase();
        const location = (result.event?.location || '').toLowerCase();
        return eventName.includes(q) || location.includes(q);
    }) : [];

    return (
        <div className="flex flex-col min-h-full h-full w-full pb-28 relative">
            <Head title="My History - The Deuce Club" />

            {/* Header */}
            <div className="flex items-center space-x-3 pt-4 mb-6">
                <Link href="/" className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </Link>
                <h1 className="text-white text-xl font-medium">My History</h1>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center">
                    <input 
                        type="text" 
                        placeholder="Search event or location..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-white text-sm w-full placeholder-white/60 p-0"
                    />
                </div>
            </div>

            {/* History List */}
            <div className="flex flex-col space-y-4">
                {filteredHistory.length > 0 ? filteredHistory.map((result) => {
                    const dateObj = new Date(result.result_date);
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = dateObj.toLocaleDateString('en-GB', { month: 'short' });
                    const year = dateObj.getFullYear();
                    
                    return (
                        <div key={result.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div className="flex items-center">
                                <span className="text-white text-[10px] mr-3 font-bold">♣</span>
                                
                                <div className="flex items-center space-x-3 border-l border-white/20 pl-3">
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="text-white text-sm font-semibold leading-none mb-0.5">{day}</span>
                                        <span className="text-white text-[9px] opacity-80 leading-none mb-0.5">{month}</span>
                                        <span className="text-white text-[7px] opacity-60 leading-none">{year}</span>
                                    </div>
                                    
                                    <div className="text-white text-xs opacity-90 leading-snug pr-2 flex-1">
                                        {result.is_checkin ? (
                                            <>
                                                Checked-in to <span className="font-semibold">{result.event?.event_name}</span> at {result.event?.location}
                                            </>
                                        ) : (
                                            <>
                                                Got <span className={getFinishWeight(result.finish)}>{result.finish}<sup className="text-[8px]">{getFinishSuffix(result.finish)}</sup> Place</span> on <span className="font-semibold">{result.event?.event_name}</span> at {result.event?.location}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <span className="text-white text-xs font-semibold shrink-0">+{result.event_points || 0} CP</span>
                        </div>
                    );
                }) : (
                    <div className="text-white text-center py-8 opacity-60">No history found.</div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-auto pt-16 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>
            
        </div>
    );
}
