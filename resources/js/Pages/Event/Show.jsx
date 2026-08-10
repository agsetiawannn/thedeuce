import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, ChevronLeft, Edit2, X, Trash2, Share2, Download, Link as LinkIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { createPortal } from 'react-dom';
import SessionResultGraphic from '../../Components/SessionResultGraphic';

export default function EventShow({ event, participants }) {
    const { auth } = usePage().props;
    const allowedEmails = ['anandazhou09@gmail.com', 'idabagusadhya@gmail.com', 'abiseka33@gmail.com', 'setiawan18221@gmail.com'];
    const isAdmin = auth?.user?.email && allowedEmails.includes(auth.user.email.toLowerCase());

    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isSessionEndedModalOpen, setIsSessionEndedModalOpen] = useState(false);
    const [isEditResultModalOpen, setIsEditResultModalOpen] = useState(false);
    const [editingResult, setEditingResult] = useState(null);
    const [editForm, setEditForm] = useState({ wins: '', losses: '', diff: '', finish: '' });
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareDataUrls, setShareDataUrls] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [shareFileName, setShareFileName] = useState('');
    const [countdown, setCountdown] = useState(30 * 60);
    const [isEditMode, setIsEditMode] = useState(false);
    const [qrToken, setQrToken] = useState(Date.now());
    const [downloadingId, setDownloadingId] = useState(null);
    const graphicRefs = React.useRef({});
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setQrToken(Date.now());
                    return 30 * 60;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const [placements, setPlacements] = useState({});

    if (!event) return null;

    const handleCheckInSimulate = () => {
        router.post(`/events/${event.event_id}/checkin`, {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsQrModalOpen(false);
                if (page.props.flash.success) {
                    alert(page.props.flash.success);
                } else if (page.props.flash.error) {
                    alert(page.props.flash.error);
                }
            }
        });
    };

    const handleResultChange = (resultId, field, value) => {
        setPlacements(prev => ({
            ...prev,
            [resultId]: {
                ...(prev[resultId] || {}),
                [field]: value
            }
        }));
    };

    const deleteParticipant = (result_id) => {
        if (confirm('Are you sure you want to remove this participant?')) {
            router.delete(`/events/${event.event_id}/checkin/${result_id}`, {
                preserveScroll: true
            });
        }
    };

    const deleteEvent = () => {
        if (confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) {
            router.delete(`/events/${event.event_id}`);
        }
    };

    const submitEndSession = () => {
        const payload = Object.entries(placements).map(([result_id, data]) => ({
            result_id,
            finish: data?.finish || '',
            wins: data?.wins !== undefined && data?.wins !== '' ? data.wins : '',
            losses: data?.losses !== undefined && data?.losses !== '' ? data.losses : '',
            diff: data?.diff !== undefined && data?.diff !== '' ? data.diff : '',
        }));

        const incomplete = payload.some(
            data => data.finish === '' || data.wins === '' || data.losses === '' || data.diff === ''
        );

        if (payload.length < participants.length || incomplete) {
            alert('Please fill out Wins, Lose, Diff, and Placing for all participants before submitting.');
            return;
        }

        router.post(`/events/${event.event_id}/end`, { placements: payload }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSessionEndedModalOpen(false);
            }
        });
    };

    const submitEditResult = () => {
        if (!editingResult) return;
        router.put(`/events/${event.event_id}/result`, { 
            result_id: editingResult.result_id,
            wins: editForm.wins !== '' ? editForm.wins : 0,
            losses: editForm.losses !== '' ? editForm.losses : 0,
            diff: editForm.diff !== '' ? editForm.diff : 0,
            finish: editForm.finish !== '' ? editForm.finish : null
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditResultModalOpen(false);
                setEditingResult(null);
            }
        });
    };

    const handleDownloadGraphic = async (resultId, name) => {
        setDownloadingId(resultId);
        try {
            const el1 = graphicRefs.current[`${resultId}_1`];
            const el2 = graphicRefs.current[`${resultId}_2`];
            if (el1 && el2) {
                // Safari iOS workaround: call toPng multiple times to ensure images are loaded in canvas
                // using pixelRatio: 1 to prevent iOS memory limit crashes (1080x1920 is already high res)
                await toPng(el1, { quality: 0.8, pixelRatio: 1 });
                await toPng(el2, { quality: 0.8, pixelRatio: 1 });
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const dataUrl1 = await toPng(el1, { quality: 1.0, pixelRatio: 1 });
                const dataUrl2 = await toPng(el2, { quality: 1.0, pixelRatio: 1 });
                
                setShareDataUrls([dataUrl1, dataUrl2]);
                setActiveSlide(0);
                setShareFileName(`${name.replace(/\s+/g, '_')}_Session_Result.png`);
                setIsShareModalOpen(true);
            }
        } catch (error) {
            console.error('Failed to generate image', error);
            alert('Failed: ' + (error.message || JSON.stringify(error) || 'Unknown error'));
        } finally {
            setDownloadingId(null);
        }
    };

    const handleSlideScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const index = Math.round(scrollLeft / width);
        setActiveSlide(index);
    };

    const handleNativeShare = async () => {
        if (shareDataUrls.length === 0) return;
        try {
            const blob = await (await fetch(shareDataUrls[activeSlide])).blob();
            const file = new File([blob], shareFileName, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'My Session Result',
                });
            } else {
                alert('Native sharing is not supported on this browser. Please use Save.');
            }
        } catch (error) {
            console.error('Share failed', error);
        }
    };

    const handleSaveImage = () => {
        if (shareDataUrls.length === 0) return;
        const link = document.createElement('a');
        link.download = shareFileName;
        link.href = shareDataUrls[activeSlide];
        link.click();
    };

    const MAX_PLAYERS = 16;
    const checkedInCount = participants ? participants.length : 0;
    const targetSlots = Math.min(MAX_PLAYERS, Math.max(8, Math.ceil(checkedInCount / 2) * 2));
    const emptySlots = Math.max(0, targetSlots - checkedInCount);

    const isEnded = event.status === 'ended';
    
    // Sort results by finish position for the Session Result display
    const finalResults = participants ? [...participants].sort((a, b) => (a.finish || 99) - (b.finish || 99)) : [];

    const loggedInResult = finalResults.find(r => r.member?.user_id === auth?.user?.id);

    const getFinishSuffix = (num) => {
        if (!num) return '';
        const j = num % 10, k = num % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
    };

    return (
        <div className="flex flex-col min-h-screen w-full relative pb-28">
            <Head title={`${event.event_name} - The Deuce Club`} />

            {/* Header with Back Button */}
            <div className="flex items-center space-x-3 pt-4 mb-8">
                <Link href="/events" className="w-8 h-8 bg-[#dfd6c5] text-[#1b2622] rounded-full flex items-center justify-center shrink-0">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                </Link>
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-white text-lg font-medium leading-tight">{event.event_name}</h1>
                    {isAdmin && !isEnded && (
                        <button 
                            onClick={() => setIsEditMode(!isEditMode)} 
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-2 ${isEditMode ? 'bg-[#dfd6c5] text-[#1b2622]' : 'bg-white/10 text-white'}`}
                        >
                            <Edit2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Event Details Section */}
            <div className="mb-10 pl-1">
                <h2 className="text-white text-lg font-medium mb-5">Event Details</h2>
                <div className="flex flex-col space-y-4 text-[#dfd6c5] text-[13px] font-medium tracking-wide">
                    <div className="flex items-center space-x-3.5">
                        <Calendar size={18} strokeWidth={2} className="opacity-80 shrink-0" />
                        <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-3.5">
                        <Clock size={18} strokeWidth={2} className="opacity-80 shrink-0" />
                        <span>{event.event_time || 'TBA'}</span>
                    </div>
                    <div className="flex items-center space-x-3.5">
                        <MapPin size={18} strokeWidth={2} className="opacity-80 shrink-0" />
                        <span>{event.location}</span>
                    </div>
                </div>
                {event.kuyy_link && (
                    <div className="mt-6">
                        <a 
                            href={event.kuyy_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-[#d4af37] text-black font-medium py-2.5 px-6 rounded-xl active:scale-[0.98] transition-transform text-sm"
                        >
                            Join through Kuyy! app
                        </a>
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-white/10 mb-8"></div>

            {!isEnded ? (
                <>
                    {/* Checked In Participant Section */}
                    <div className="mb-8 relative">
                        <h2 className="text-white text-lg font-medium mb-4">Checked In Participant</h2>
                        
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            {participants && participants.map((p, idx) => (
                                <div key={p.result_id} className="bg-[#dfd6c5] text-[#1b2622] text-xs font-semibold py-2 rounded-full text-center flex items-center justify-center shadow-sm truncate px-2 relative group">
                                    <span className="truncate">{p.name}</span>
                                    {isEditMode && (
                                        <button 
                                            onClick={() => deleteParticipant(p.result_id)}
                                            className="absolute right-1 w-6 h-6 bg-[#9c3232] text-white rounded-full flex items-center justify-center"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            {[...Array(emptySlots)].map((_, i) => (
                                <div key={`empty-${i}`} className="bg-[#dfd6c5]/20 text-[#dfd6c5]/50 border border-dashed border-[#dfd6c5]/30 text-[10px] font-medium py-2 rounded-full text-center flex items-center justify-center">
                                    [slot available]
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-right text-[#dfd6c5] text-[9px] opacity-70 mt-3">
                            {checkedInCount} players already checked in
                        </div>

                        {/* Admin Action Buttons */}
                        {isAdmin && (
                            <div className="flex flex-col mt-8 border-t border-white/10 pt-8 space-y-4">
                                <div className="flex justify-between">
                                    <button 
                                        onClick={() => setIsQrModalOpen(true)}
                                        className="bg-[#247c64] text-white text-[10px] font-medium py-2.5 px-6 rounded-lg text-center shadow-sm"
                                    >
                                        [generate QR]
                                    </button>
                                    {checkedInCount > 0 && (
                                        <button 
                                            onClick={() => setIsSessionEndedModalOpen(true)}
                                            className="bg-[#9c3232] text-white text-[10px] font-medium py-2.5 px-6 rounded-lg text-center shadow-sm"
                                        >
                                            [end session]
                                        </button>
                                    )}
                                </div>
                                {isEditMode && (
                                    <button 
                                        onClick={deleteEvent}
                                        className="bg-[#9c3232] text-white text-[10px] font-medium py-2.5 px-6 rounded-lg text-center shadow-sm w-full"
                                    >
                                        [delete event]
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Session Result Section */}
                    <div className="mb-8">
                        <h2 className="text-white text-lg font-medium mb-6">Session Result</h2>
                        
                        <div className="flex flex-col space-y-4">
                            {finalResults.length === 0 && (
                                <div className="text-white/60 text-sm text-center py-4">No participants found.</div>
                            )}
                            
                            {finalResults.map((result) => {
                                const rank = result.finish;
                                const isTop3 = rank <= 3;
                                
                                let clubColor = '#dfd6c5'; // default
                                if (rank === 1) clubColor = '#d4af37'; // gold
                                if (rank === 2) clubColor = '#c0c0c0'; // silver
                                if (rank === 3) clubColor = '#cd7f32'; // bronze

                                return (
                                    <div key={result.result_id} className="flex items-center justify-between text-white text-sm">
                                        <div className="flex items-center space-x-4 w-2/3">
                                            {isTop3 ? (
                                                <span className="text-xs font-bold w-4 text-center" style={{ color: clubColor }}>♣</span>
                                            ) : (
                                                <span className="text-[#dfd6c5] text-[10px] w-4 text-center">{rank}{getFinishSuffix(rank)}</span>
                                            )}
                                            
                                            {result.member?.user?.avatar ? (
                                                <img src={result.member.user.avatar} alt={result.name} className={`w-5 h-5 rounded-full shrink-0 ${!isTop3 ? 'opacity-80' : ''}`} />
                                            ) : (
                                                <div className={`w-5 h-5 bg-[#dfd6c5] rounded-full shrink-0 ${!isTop3 ? 'opacity-80' : ''}`}></div>
                                            )}
                                            
                                            <span className={isTop3 ? 'font-medium' : ''}>{result.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-[10px] text-white/50 w-[85px] text-right font-mono tracking-tighter">
                                                {result.wins || 0}W {result.losses || 0}L {(result.diff && result.diff > 0 ? '+' : '')}{result.diff || 0}DIFF
                                            </span>
                                            <span className={`w-[30px] text-right whitespace-nowrap ${isTop3 ? 'font-semibold' : 'font-medium text-[#dfd6c5]'}`}>{result.placement_bonus || 0} CP</span>
                                            {isAdmin && isEditMode && (
                                                <button 
                                                    onClick={() => {
                                                        setEditingResult(result);
                                                        setEditForm({
                                                            wins: result.wins !== null && result.wins !== undefined ? result.wins : '',
                                                            losses: result.losses !== null && result.losses !== undefined ? result.losses : '',
                                                            diff: result.diff !== null && result.diff !== undefined ? result.diff : '',
                                                            finish: result.finish !== null && result.finish !== undefined ? result.finish : ''
                                                        });
                                                        setIsEditResultModalOpen(true);
                                                    }}
                                                    className="w-5 h-5 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-md shrink-0 ml-1"
                                                >
                                                    <Edit2 size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {loggedInResult && (
                            <div className="mt-8 flex items-center justify-center w-full">
                                <button 
                                    onClick={() => handleDownloadGraphic(loggedInResult.result_id, loggedInResult.name)}
                                    disabled={downloadingId !== null}
                                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium uppercase tracking-widest py-3 px-6 rounded-full transition-colors disabled:opacity-50 border border-white/20"
                                >
                                    {downloadingId !== null ? 'GENERATING...' : 'GENERATE SESSION RESULT'}
                                </button>

                                {/* Hidden Graphic for Generation */}
                                <div className="absolute top-0 left-0 opacity-0 pointer-events-none z-[-1000]">
                                    <SessionResultGraphic 
                                        ref={(el) => (graphicRefs.current[`${loggedInResult.result_id}_1`] = el)}
                                        layout={1}
                                        eventName={event.event_name}
                                        placement={loggedInResult.finish}
                                        wins={loggedInResult.wins || 0}
                                        losses={loggedInResult.losses || 0}
                                        winRate={loggedInResult.wins + loggedInResult.losses > 0 ? Math.round((loggedInResult.wins / (loggedInResult.wins + loggedInResult.losses)) * 100) : 0}
                                        pointsEarned={loggedInResult.placement_bonus || 0}
                                        tier={loggedInResult.member?.status_tier || 'CLUB'}
                                        date={new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                                        location={event.location.toUpperCase()}
                                    />
                                    <SessionResultGraphic 
                                        ref={(el) => (graphicRefs.current[`${loggedInResult.result_id}_2`] = el)}
                                        layout={2}
                                        eventName={event.event_name}
                                        placement={loggedInResult.finish}
                                        wins={loggedInResult.wins || 0}
                                        losses={loggedInResult.losses || 0}
                                        winRate={loggedInResult.wins + loggedInResult.losses > 0 ? Math.round((loggedInResult.wins / (loggedInResult.wins + loggedInResult.losses)) * 100) : 0}
                                        pointsEarned={loggedInResult.placement_bonus || 0}
                                        tier={loggedInResult.member?.status_tier || 'CLUB'}
                                        date={new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                                        location={event.location.toUpperCase()}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-8 mb-8 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>

            {/* QR Modal Overlay */}
            {isQrModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                    <div className="bg-[#0c0c0c] w-full max-w-[340px] rounded-3xl p-6 relative shadow-2xl">
                        <button 
                            onClick={() => setIsQrModalOpen(false)}
                            className="absolute top-5 right-5 text-white/80 hover:text-white"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                        
                        <h2 className="text-white text-[15px] font-medium mb-4">Check-In</h2>
                        
                        <div className="text-[#e23b3b] text-[11px] mb-8 font-medium tracking-wide">
                            [countdown {formatTime(countdown)}]
                        </div>
                        
                        <div className="bg-[#d9d9d9] w-full aspect-square rounded-xl flex items-center justify-center shadow-inner mb-6 relative overflow-hidden">
                            <QRCodeSVG 
                                value={`${window.location.origin}/events/${event.event_id}/checkin?t=${qrToken}`} 
                                size={240} 
                                bgColor="#d9d9d9" 
                                fgColor="#0c0c0c" 
                                level="H" 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Session Ended Modal Overlay */}
            {isSessionEndedModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                    <div className="bg-gradient-to-b from-[#30453d] to-[#4c6258] w-full max-w-[340px] rounded-3xl p-6 pb-8 relative shadow-2xl border border-white/5">
                        <button 
                            onClick={() => setIsSessionEndedModalOpen(false)}
                            className="absolute top-5 right-5 text-white/80 hover:text-white"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                        
                        <h2 className="text-white text-[15px] font-medium mb-8">Session Ended</h2>
                        
                        <div className="grid grid-cols-12 text-white text-[10px] mb-4 gap-1 opacity-80 uppercase tracking-wider text-center">
                            <span className="col-span-3 text-left">Name</span>
                            <span className="col-span-2">Wins</span>
                            <span className="col-span-2">Lose</span>
                            <span className="col-span-2">Diff</span>
                            <span className="col-span-3">Placing</span>
                        </div>
                        
                        <div className="flex flex-col space-y-3 mb-8">
                            {participants && participants.map((p) => (
                                <div key={p.result_id} className="grid grid-cols-12 items-center gap-1">
                                    <div className="col-span-3 flex items-center space-x-1.5 truncate pr-1">
                                        {p.member?.user?.avatar ? (
                                            <img src={p.member.user.avatar} className="w-[14px] h-[14px] rounded-full shrink-0" alt="avatar" />
                                        ) : (
                                            <div className="w-[14px] h-[14px] bg-white/80 rounded-full shrink-0"></div>
                                        )}
                                        <span className="text-white text-[10px] font-medium truncate">{p.name}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <input 
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={placements[p.result_id]?.wins !== undefined ? placements[p.result_id].wins : ''}
                                            onChange={(e) => handleResultChange(p.result_id, 'wins', e.target.value)}
                                            className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input 
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={placements[p.result_id]?.losses !== undefined ? placements[p.result_id].losses : ''}
                                            onChange={(e) => handleResultChange(p.result_id, 'losses', e.target.value)}
                                            className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input 
                                            type="number"
                                            placeholder="0"
                                            value={placements[p.result_id]?.diff !== undefined ? placements[p.result_id].diff : ''}
                                            onChange={(e) => handleResultChange(p.result_id, 'diff', e.target.value)}
                                            className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <select 
                                            value={placements[p.result_id]?.finish || ''}
                                            onChange={(e) => handleResultChange(p.result_id, 'finish', e.target.value)}
                                            className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50"
                                        >
                                            <option value="">-</option>
                                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={submitEndSession}
                                className="bg-[#247c64] text-white text-[11px] font-medium py-2 px-6 rounded text-center shadow-md hover:bg-[#1f6b55] transition-colors"
                            >
                                submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Result Modal Overlay */}
            {isEditResultModalOpen && editingResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                    <div className="bg-gradient-to-b from-[#4a3922] to-[#2c2014] w-full max-w-[340px] rounded-3xl p-6 pb-8 relative shadow-2xl border border-white/5">
                        <button 
                            onClick={() => {
                                setIsEditResultModalOpen(false);
                                setEditingResult(null);
                            }}
                            className="absolute top-5 right-5 text-white/80 hover:text-white"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                        
                        <h2 className="text-white text-[15px] font-medium mb-2">Edit Result</h2>
                        <div className="text-[#dfd6c5] text-xs mb-6">For {editingResult.name}</div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-white/60 text-[10px] mb-1">Wins</label>
                                <input 
                                    type="number"
                                    value={editForm.wins}
                                    onChange={(e) => setEditForm({...editForm, wins: e.target.value})}
                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-sm py-2 px-3 focus:ring-1 focus:ring-[#dfd6c5]"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-[10px] mb-1">Losses</label>
                                <input 
                                    type="number"
                                    value={editForm.losses}
                                    onChange={(e) => setEditForm({...editForm, losses: e.target.value})}
                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-sm py-2 px-3 focus:ring-1 focus:ring-[#dfd6c5]"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-[10px] mb-1">Diff</label>
                                <input 
                                    type="number"
                                    value={editForm.diff}
                                    onChange={(e) => setEditForm({...editForm, diff: e.target.value})}
                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-sm py-2 px-3 focus:ring-1 focus:ring-[#dfd6c5]"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-[10px] mb-1">Placement</label>
                                <select 
                                    value={editForm.finish}
                                    onChange={(e) => setEditForm({...editForm, finish: e.target.value})}
                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-sm py-2 px-3 focus:ring-1 focus:ring-[#dfd6c5]"
                                >
                                    <option value="">-</option>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mt-2">
                            <button 
                                onClick={submitEditResult}
                                className="bg-[#d4af37] text-black text-[11px] font-medium py-2.5 px-8 rounded shadow-md hover:bg-[#c09d31] transition-colors uppercase tracking-wider"
                            >
                                Update Result
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {isShareModalOpen && shareDataUrls.length > 0 && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col bg-[#111111]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 pt-20 border-b border-white/10 shrink-0">
                        <button 
                            onClick={() => setIsShareModalOpen(false)}
                            className="p-2 -ml-2 text-white/80 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-white text-base font-medium absolute left-1/2 -translate-x-1/2">
                            Share Activity
                        </h2>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden relative" 
                         style={{
                             backgroundImage: "linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)",
                             backgroundSize: "20px 20px",
                             backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
                         }}>
                        <div 
                            className="flex overflow-x-auto snap-x snap-mandatory w-full h-full hide-scrollbar items-center"
                            onScroll={handleSlideScroll}
                        >
                            {shareDataUrls.map((url, i) => (
                                <div key={i} className="snap-center shrink-0 w-full h-full flex flex-col items-center justify-center px-2">
                                    <img 
                                        src={url} 
                                        alt={`Session Result Style ${i+1}`} 
                                        className="max-w-full max-h-[85%] object-contain shadow-2xl rounded" 
                                    />
                                    <div className="text-white/50 text-[10px] mt-4 uppercase tracking-widest font-medium">Style {i+1}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex space-x-2 mt-4 absolute bottom-4">
                            {shareDataUrls.map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeSlide ? 'bg-white' : 'bg-white/30'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Share Action Sheet */}
                    <div className="bg-[#1a1a1a] p-6 pb-14 pt-8 rounded-t-3xl border-t border-white/5 shrink-0">
                        <h3 className="text-white font-medium mb-6">Share to</h3>
                        <div className="flex items-center space-x-6 overflow-x-auto pb-4 hide-scrollbar">
                            
                            <div className="flex flex-col items-center space-y-2 cursor-pointer shrink-0" onClick={handleNativeShare}>
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center mb-1">
                                    <div className="w-[52px] h-[52px] bg-[#1a1a1a] rounded-full flex items-center justify-center">
                                        <Share2 size={24} className="text-white" />
                                    </div>
                                </div>
                                <span className="text-white text-[10px] text-center w-16 leading-tight font-medium">Share <br/> & Save</span>
                            </div>

                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
