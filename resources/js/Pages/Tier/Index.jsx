import React, { useRef, useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function TierIndex() {
    const scrollContainerRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const { auth } = usePage().props;
    const cp = auth?.member?.lifetime_points || 0;

    useEffect(() => {
        let initialSlide = 0;
        let tier = 'DIAMOND';
        if (cp >= 4500) tier = 'ACE';
        else if (cp >= 2000) tier = 'SPADE';
        else if (cp >= 1000) tier = 'HEART';
        else if (cp >= 350) tier = 'CLUB';

        if (tier === 'CLUB') initialSlide = 1;
        else if (tier === 'HEART') initialSlide = 2;
        else if (tier === 'SPADE') initialSlide = 3;
        else if (tier === 'ACE') initialSlide = 4;

        setActiveSlide(initialSlide);

        setTimeout(() => {
            if (scrollContainerRef.current) {
                const cardWidth = scrollContainerRef.current.clientWidth * 0.85 + 16; // 85% width + 16px space
                scrollContainerRef.current.scrollTo({
                    left: initialSlide * cardWidth,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }, []);

    const slides = [
        {
            image: '/img/tier/Frame 7.png',
            isUnlocked: true, // Everyone is at least Diamond
            title: 'Welcome to Diamond Tier.',
            desc: 'Every great player starts somewhere. Show up, play often, and enjoy every rally. Your journey has just begun.'
        },
        {
            image: cp >= 350 ? '/img/tier/Frame 8.png' : '/img/tier/Frame 12.png',
            isUnlocked: cp >= 350,
            targetTier: 'Club',
            pointsNeeded: Math.max(0, 350 - cp).toLocaleString(),
            currentPoints: Math.min(cp, 350),
            maxPoints: 350,
            progressPercent: Math.min(100, (cp/350)*100),
            title: 'Welcome to Club Tier.',
            desc: 'You have proven your dedication to the court. New challenges await you.'
        },
        {
            image: cp >= 1000 ? '/img/tier/Frame 9.png' : '/img/tier/Frame 13.png',
            isUnlocked: cp >= 1000,
            targetTier: 'Heart',
            pointsNeeded: Math.max(0, 1000 - cp).toLocaleString(),
            currentPoints: Math.min(cp, 1000),
            maxPoints: 1000,
            progressPercent: Math.min(100, (cp/1000)*100),
            title: 'Welcome to Heart Tier.',
            desc: 'Your passion for the game shines through. Keep pushing your limits.'
        },
        {
            image: cp >= 2000 ? '/img/tier/Frame 10.png' : '/img/tier/Frame 14.png',
            isUnlocked: cp >= 2000,
            targetTier: 'Spade',
            pointsNeeded: Math.max(0, 2000 - cp).toLocaleString(),
            currentPoints: Math.min(cp, 2000),
            maxPoints: 2000,
            progressPercent: Math.min(100, (cp/2000)*100),
            title: 'Welcome to Spade Tier.',
            desc: 'You are part of the elite. Consistency is your greatest weapon.'
        },
        {
            image: cp >= 4500 ? '/img/tier/Frame 11.png' : '/img/tier/Frame 15.png',
            isUnlocked: cp >= 4500,
            targetTier: 'Ace',
            pointsNeeded: Math.max(0, 4500 - cp).toLocaleString(),
            currentPoints: Math.min(cp, 4500),
            maxPoints: 4500,
            progressPercent: Math.min(100, (cp/4500)*100),
            title: 'Welcome to Ace Tier.',
            desc: 'The pinnacle of achievement. You are among the very best.'
        }
    ];

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const scrollPosition = scrollContainerRef.current.scrollLeft;
        const cardWidth = scrollContainerRef.current.clientWidth;

        // Calculate which slide is most visible based on scroll position
        // We use 0.85 because the cards are 85% width
        const actualCardWidth = cardWidth * 0.85;
        const currentIndex = Math.round(scrollPosition / actualCardWidth);

        if (currentIndex !== activeSlide && currentIndex >= 0 && currentIndex < slides.length) {
            setActiveSlide(currentIndex);
        }
    };

    return (
        <div className="flex flex-col min-h-full h-full w-full pb-28">
            <Head title="Tier Class - The Deuce Club" />

            {/* Header */}
            <div className="flex items-center space-x-3 pt-4 mb-8">
                <Link href="/" className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </Link>
                <h1 className="text-white text-lg font-medium">Tier Class</h1>
            </div>

            {/* Title Section */}
            <div className="mb-6">
                <h2 className="text-white text-xl font-medium mb-2">[TDC] Tier Class</h2>
                <p className="text-[#dfd6c5] opacity-80 text-xs leading-relaxed pr-4">
                    Every match moves you forward. Earn Club Points, unlock new tiers, and enjoy exclusive rewards as we celebrate every milestone of your journey.
                </p>
            </div>

            {/* Carousel Section */}
            <div className="mb-6 -mx-6">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pl-6 pr-6 space-x-4 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-[85%] shrink-0 snap-center relative rounded-3xl overflow-hidden shadow-xl bg-transparent">
                            {/* Maintain aspect ratio similar to a credit card */}
                            <div className="w-full relative" style={{ paddingTop: '58%' }}>
                                <img
                                    src={slide.image}
                                    alt={`Tier Frame ${index + 7}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add an empty div at the end to allow the last item to be centered by the padding */}
                    <div className="w-2 shrink-0"></div>
                </div>
            </div>

            {/* Dynamic Text Section */}
            <div className="mt-2 transition-opacity duration-300 min-h-[100px]">
                {slides[activeSlide].isUnlocked ? (
                    <>
                        <h3 className="text-white text-[13px] font-semibold mb-2">{slides[activeSlide].title}</h3>
                        <p className="text-[#dfd6c5] opacity-80 text-[11px] leading-relaxed">
                            {slides[activeSlide].desc}
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="text-white text-[13px] font-semibold mb-3">Gain {slides[activeSlide].pointsNeeded} CP more to unlock {slides[activeSlide].targetTier}.</h3>
                        <div className="w-full bg-[#323634] rounded-full h-[18px] mb-2 relative overflow-hidden shadow-inner">
                            <div className="bg-[#2a7a60] h-full rounded-full" style={{ width: `${slides[activeSlide].progressPercent}%` }}></div>
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium tracking-wider">
                                <span className="text-[#dfd6c5] opacity-90">{slides[activeSlide].currentPoints} / {slides[activeSlide].maxPoints} CP</span>
                            </div>
                        </div>
                    </>
                )}
                <div className="w-full h-px bg-white/10 mt-6"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-auto pt-16 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>

            {/* Add global style to hide scrollbar for webkit */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
            
        </div>
    );
}
