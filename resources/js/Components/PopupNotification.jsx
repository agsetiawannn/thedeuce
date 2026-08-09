import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function PopupNotification({ notification, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            setStep(1);
        }
    }, [notification]);

    const handleActionClick = () => {
        if (notification?.data?.type === 'tier_up' && step === 1) {
            setStep(2);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        // Mark as read in backend
        router.post('/notifications/read', { id: notification.id }, {
            preserveScroll: true,
            onSuccess: () => {
                setTimeout(onClose, 300); // Wait for transition
            }
        });
    };

    if (!notification) return null;

    const { type, data } = notification;

    // Visuals are basic placeholders that the user will improve later
    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'bg-black/80 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
            <div className={`bg-[#0c1410] border border-white/10 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 p-1 rounded-full transition-colors z-10"
                >
                    <X size={18} />
                </button>

                <div className="flex flex-col items-center justify-center py-6">
                    {data.type === 'tier_up' && step === 1 && (
                        <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#d4af37]/20 blur-xl rounded-full animate-pulse"></div>
                            <img src={`/img/tier_${data.meta.new_tier.toLowerCase()}.png`} alt="Tier" className="w-16 h-16 object-contain relative z-10 drop-shadow-2xl" />
                        </div>
                    )}
                    
                    {data.type === 'monthly_recap' && step === 1 && (
                        <div className="w-20 h-20 bg-gradient-to-br from-[#dfd6c5] to-[#aa8323] rounded-2xl mb-6 flex items-center justify-center shadow-lg transform rotate-3">
                            <span className="text-black font-bold text-3xl">#{data.meta.rank}</span>
                        </div>
                    )}

                    {step === 1 ? (
                        <>
                            <h2 className="text-white text-2xl font-semibold text-center mb-2">{data.title}</h2>
                            <p className="text-[#dfd6c5] opacity-80 text-center text-sm px-4">
                                {data.message}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-white text-xl font-semibold text-center mb-4">Screenshot this!</h2>
                            <p className="text-[#dfd6c5] opacity-90 text-center text-[13px] px-2 leading-relaxed">
                                Screenshot this as proof to claim your Exclusive The Deuce Club Water Bottle and your Club Membership Voucher Code.
                            </p>
                        </>
                    )}

                    <button 
                        onClick={handleActionClick}
                        className="mt-8 w-full bg-gradient-to-r from-[#dfd6c5] to-[#c4b697] text-black font-semibold rounded-xl py-3.5 shadow-lg active:scale-95 transition-transform"
                    >
                        {data.type === 'tier_up' && step === 1 ? 'Claim Rewards' : (step === 2 ? 'Awesome!' : 'Awesome!')}
                    </button>
                </div>
            </div>
        </div>
    );
}
