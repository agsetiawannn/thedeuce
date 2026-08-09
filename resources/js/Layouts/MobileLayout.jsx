import React, { useRef, useState, createContext, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import BottomNav from '../Components/BottomNav';

export const PullContext = createContext({ pullDistance: 0, isRefreshing: false });

export default function MobileLayout({ children, customTranslate = false }) {
    const containerRef = useRef(null);
    const [startY, setStartY] = useState(0);
    const [startX, setStartX] = useState(0);
    const [isSwipeHorizontal, setIsSwipeHorizontal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);

    useEffect(() => {
        document.body.style.overscrollBehavior = 'none';
        document.body.style.backgroundColor = '#0D3127';
        
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.style.backgroundColor = 'transparent';
        }

        return () => {
            document.body.style.overscrollBehavior = '';
            document.body.style.backgroundColor = '';
            if (appElement) {
                appElement.style.backgroundColor = '';
            }
        };
    }, []);

    // Prevent iOS native rubber-banding by intercepting touchmove with a non-passive listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let localStartY = 0;
        let localStartX = 0;
        let localIsHorizontal = false;

        const onTouchStartNative = (e) => {
            if (window.scrollY <= 0) {
                localStartY = e.touches[0].clientY;
                localStartX = e.touches[0].clientX;
                localIsHorizontal = false;
            } else {
                localStartY = 0;
            }
        };

        const onTouchMoveNative = (e) => {
            if (localStartY > 0) {
                const currentY = e.touches[0].clientY;
                const currentX = e.touches[0].clientX;
                const distanceY = currentY - localStartY;
                const distanceX = Math.abs(currentX - localStartX);
                
                if (distanceX > Math.abs(distanceY)) {
                    localIsHorizontal = true;
                }

                if (!localIsHorizontal && distanceY > 0 && e.cancelable) {
                    e.preventDefault();
                }
            }
        };

        container.addEventListener('touchstart', onTouchStartNative, { passive: true });
        container.addEventListener('touchmove', onTouchMoveNative, { passive: false });

        return () => {
            container.removeEventListener('touchstart', onTouchStartNative);
            container.removeEventListener('touchmove', onTouchMoveNative);
        };
    }, []);

    const handleTouchStart = (e) => {
        if (window.scrollY <= 0) {
            setStartY(e.touches[0].clientY);
            setStartX(e.touches[0].clientX);
            setIsSwipeHorizontal(false);
        } else {
            setStartY(0);
        }
    };

    const handleTouchMove = (e) => {
        if (startY > 0) {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const distanceY = currentY - startY;
            const distanceX = Math.abs(currentX - startX);

            if (distanceX > Math.abs(distanceY)) {
                setIsSwipeHorizontal(true);
            }

            if (!isSwipeHorizontal && distanceY > 0) {
                // Prevent overscrolling too much, cap at 80
                setPullDistance(Math.min(distanceY * 0.4, 80));
            }
        }
    };

    const handleTouchEnd = () => {
        if (pullDistance > 60 && !isRefreshing) {
            setIsRefreshing(true);
            
            // Soft reload for beautiful seamless data refresh
            router.reload({
                only: [],
                onFinish: () => {
                    // Small delay so the user can enjoy the popup animation
                    setTimeout(() => {
                        setIsRefreshing(false);
                        setPullDistance(0);
                    }, 800);
                }
            });
        } else {
            setPullDistance(0);
        }
        setStartY(0);
    };

    const { url } = usePage();
    const isHome = url === '/';
    
    return (
        <div className="min-h-[100dvh] w-full bg-[#0D3127] flex justify-center relative overflow-hidden">
            {/* Global Loading Animation Area */}
            <div 
                className={`absolute left-0 right-0 flex justify-center items-center space-x-2.5 z-0 transition-opacity duration-300 pointer-events-none ${
                    (isRefreshing || pullDistance > 10) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                    top: isHome ? 'calc(116px + env(safe-area-inset-top))' : 'calc(40px + env(safe-area-inset-top))', 
                    height: '30px' 
                }}
            >
                <img src="/img/white.png" alt="loading" className={`w-6 h-6 object-contain opacity-0 ${isRefreshing || pullDistance > 40 ? 'animate-[stumbleFade_1.2s_infinite_0s]' : ''}`} />
                <img src="/img/white.png" alt="loading" className={`w-6 h-6 object-contain opacity-0 ${isRefreshing || pullDistance > 40 ? 'animate-[stumbleFade_1.2s_infinite_0.2s]' : ''}`} />
                <img src="/img/white.png" alt="loading" className={`w-6 h-6 object-contain opacity-0 ${isRefreshing || pullDistance > 40 ? 'animate-[stumbleFade_1.2s_infinite_0.4s]' : ''}`} />
            </div>

            <div 
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full max-w-[430px] min-h-[100dvh] flex flex-col p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:rounded-3xl sm:shadow-2xl relative overflow-x-hidden"
                style={{ 
                    transform: (!customTranslate && pullDistance > 0) ? `translateY(${pullDistance}px)` : 'none',
                    transition: (!customTranslate && (isRefreshing || pullDistance === 0)) ? 'transform 0.3s ease-out' : 'none'
                }}
            >
                <PullContext.Provider value={{ pullDistance, isRefreshing }}>
                    <div className="relative z-10 flex flex-col flex-1 w-full h-full">
                        {children}
                    </div>
                </PullContext.Provider>
            </div>
            
            {/* Global Bottom Navbar */}
            <BottomNav activeTab={
                url === '/' || url.startsWith('/tier') || url.startsWith('/leaderboard') ? 'home' :
                url.startsWith('/event') ? 'events' :
                url.startsWith('/check-in') ? 'checkin' :
                url.startsWith('/profile') || url.startsWith('/history') ? 'profile' :
                'home'
            } />
        </div>
    );
}
