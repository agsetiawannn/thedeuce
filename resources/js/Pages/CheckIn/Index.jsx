import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CheckInIndex() {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        let html5QrCode;
        
        try {
            html5QrCode = new Html5Qrcode("reader");
            
            const config = { fps: 10, qrbox: { width: 250, height: 250 }, disableFlip: true };
            
            html5QrCode.start({ facingMode: "environment" }, config, success, error)
            .catch(err => {
                console.error("Error starting scanner", err);
            });
        } catch (err) {
            console.error("Error initializing scanner", err);
        }

        function success(result) {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                }).catch(e => console.error(e));
            }
            
            try {
                // If it's a URL
                if (result.includes('/events/') && result.includes('/checkin')) {
                    setScanResult("Redirecting to check-in...");
                    window.location.href = result;
                    return;
                }
                
                // Fallback for old format
                const data = JSON.parse(result);
                if (data.type === 'event_checkin' && data.event_id) {
                    setScanResult("Checking in to event " + data.event_id + "...");
                    router.post(`/events/${data.event_id}/checkin`, {}, {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            if (page.props.flash.success) {
                                setScanResult(page.props.flash.success);
                            } else if (page.props.flash.error) {
                                setScanResult(page.props.flash.error);
                            } else {
                                setScanResult("Processed successfully.");
                            }
                        },
                        onError: () => {
                            setScanResult("Check-in failed. Please try again.");
                        }
                    });
                } else {
                    setScanResult("Format QR Code tidak valid atau bukan untuk check-in event.");
                }
            } catch (e) {
                setScanResult("Format QR Code tidak valid.");
            }
        }

        function error(err) {
            // Silently handle scan errors (it triggers every frame it doesn't find a code)
        }

        return () => {
            // Cleanup on unmount
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                }).catch(error => {
                    console.error("Failed to clear html5Qrcode. ", error);
                });
            }
        };
    }, []);

    return (
        <div className="flex flex-col min-h-full h-full w-full relative pb-8">
            <Head title="Scan to Check-In - The Deuce Club" />
            
            <div className="pt-4 mb-8">
                <h1 className="text-white text-xl font-medium">Scan to Check-In</h1>
                <p className="text-[#dfd6c5] opacity-70 text-[11px] mt-2">Position the QR code inside the frame to scan.</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start pt-8">
                {scanResult ? (
                    <div className="text-white text-center mt-10">
                        <p className="text-[#247c64] font-medium text-lg mb-4">Success!</p>
                        <p className="text-sm opacity-80 mb-8 break-all px-6">{scanResult}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-white/10 text-white px-6 py-2 rounded-full text-xs font-medium"
                        >
                            Scan Again
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-[300px] mx-auto overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl relative">
                        {/* The ID 'reader' is required by Html5QrcodeScanner */}
                        <style dangerouslySetInnerHTML={{__html: `
                            #reader { border: none !important; }
                            #reader button { background: #dfd6c5; color: #1b2622; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 11px; text-transform: uppercase; margin-bottom: 10px; cursor: pointer; }
                            #reader a { color: #dfd6c5; text-decoration: none; }
                        `}} />
                        <div id="reader" className="w-full min-h-[300px]"></div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-auto pt-8 mb-20 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>
        </div>
    );
}
