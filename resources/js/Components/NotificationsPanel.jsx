import React from 'react';
import { router } from '@inertiajs/react';
import { X, CheckCircle2, ChevronRight, Trophy, ArrowUpCircle, CalendarDays } from 'lucide-react';

export default function NotificationsPanel({ notifications, isOpen, onClose }) {
    const handleMarkAsRead = (id) => {
        router.post('/notifications/read', { id }, { preserveScroll: true });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read', {}, { preserveScroll: true });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'points_checkin': return <CheckCircle2 className="text-[#247c64]" size={20} />;
            case 'points_placement': return <Trophy className="text-[#d4af37]" size={20} />;
            case 'tier_up': return <ArrowUpCircle className="text-[#aa8323]" size={20} />;
            case 'monthly_recap': return <CalendarDays className="text-[#dfd6c5]" size={20} />;
            default: return <ChevronRight className="text-[#dfd6c5]" size={20} />;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div 
                className={`fixed top-0 left-0 right-0 bg-[#0c1410] rounded-b-3xl border-b border-white/10 z-[160] pt-14 pb-2 transition-transform duration-300 transform ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
                style={{ maxHeight: '85vh' }}
            >

                <div className="flex justify-between items-center px-6 py-2 border-b border-white/5">
                    <h3 className="text-white font-medium text-lg">Notifications</h3>
                    {notifications.length > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-[#d4af37] text-xs hover:underline">
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto px-4 py-2" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 opacity-50">
                            <span className="text-white mt-4 text-sm">No new notifications</span>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-2 mt-2 pb-6">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start space-x-3">
                                    <div className="bg-[#111a15] p-2 rounded-full mt-0.5">
                                        {getIcon(notif.data.type)}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <span className="text-white font-medium text-sm">{notif.data.title}</span>
                                            <span className="text-white/40 text-[10px]">{new Date(notif.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <span className="text-[#dfd6c5] opacity-80 text-xs mt-1 leading-relaxed">{notif.data.message}</span>
                                        <button onClick={() => handleMarkAsRead(notif.id)} className="text-[#d4af37] text-[10px] self-start mt-2 border border-[#d4af37]/30 px-2 py-0.5 rounded hover:bg-[#d4af37]/10 transition-colors">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
