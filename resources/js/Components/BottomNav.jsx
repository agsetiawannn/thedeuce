import React, { useContext } from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, QrCode, User } from 'lucide-react';
import { PullContext } from '../Layouts/MobileLayout';

export default function BottomNav({ activeTab }) {
    const { pullDistance, isRefreshing } = useContext(PullContext);
    const shouldHide = activeTab !== 'home' && (pullDistance > 10 || isRefreshing);

    return (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[99] px-4 pointer-events-none transition-all duration-300 ${shouldHide ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
            <div className="w-full pointer-events-auto">
                {/* Glass Nav */}
                <div className="bg-[#121815]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex justify-between items-center px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

                    {/* Home Tab */}
                    <Link href="/" className={`flex flex-col items-center space-y-1 transition-opacity ${activeTab === 'home' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                        <div className="w-5 h-5 flex items-center justify-center mb-1">
                            <img src="/img/home.png" alt="Home" className="w-5 h-5 object-contain" />
                        </div>
                        <span className="text-white text-[9px] font-medium leading-none">Home</span>
                    </Link>

                    {/* Events Tab */}
                    <Link href="/events" className={`flex flex-col items-center space-y-1 transition-opacity ${activeTab === 'events' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                        <Calendar size={18} className="text-[#dfd6c5] mb-1" strokeWidth={1.5} />
                        <span className="text-[#dfd6c5] text-[9px] leading-none">Events</span>
                    </Link>

                    {/* Check-In Tab */}
                    <Link href="/check-in" className={`flex flex-col items-center space-y-1 transition-opacity ${activeTab === 'checkin' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                        <QrCode size={18} className="text-[#dfd6c5] mb-1" strokeWidth={1.5} />
                        <span className="text-[#dfd6c5] text-[9px] leading-none">Check-In</span>
                    </Link>

                    {/* Profile Tab */}
                    <Link href="/profile" className={`flex flex-col items-center space-y-1 transition-opacity ${activeTab === 'profile' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                        <User size={18} className="text-[#dfd6c5] mb-1" strokeWidth={1.5} />
                        <span className="text-[#dfd6c5] text-[9px] leading-none">Profile</span>
                    </Link>

                </div>
            </div>
        </div>
    );
}
