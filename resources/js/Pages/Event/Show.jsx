import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, MapPin, ChevronLeft, Edit2, X, Trash2, Share2, Download, Link as LinkIcon, Camera, Image as ImageIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas-pro';
import { createPortal } from 'react-dom';
import SessionResultGraphic from '../../Components/SessionResultGraphic';

export default function EventShow({ event, participants, eventPhotos = [] }) {
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
    const [activeQrTeam, setActiveQrTeam] = useState(null);
    const graphicRefs = React.useRef({});

    // Photo upload/download states
    const [isUploading, setIsUploading] = useState(false);
    const [isPhotoFrameModalOpen, setIsPhotoFrameModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedFrame, setSelectedFrame] = useState(1);
    const [isGeneratingFramed, setIsGeneratingFramed] = useState(false);
    const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);
    const photoInputRef = useRef(null);
    const framedCanvasRef = useRef(null);
    
    const isFixedPartner = event?.event_format === 'fixed_partner';
    
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
                // Using html2canvas which is much more robust for iOS Safari than html-to-image
                // It doesn't rely on SVG foreignObject, so it avoids all canvas tainting and isTrusted events.
                
                // Render first layout
                const canvas1 = await html2canvas(el1, {
                    scale: 1, // 1080x1920 is already huge
                    useCORS: true,
                    backgroundColor: null,
                    logging: false,
                    width: 1080,
                    height: 1920,
                    windowWidth: 1080,
                    windowHeight: 1920
                });
                const dataUrl1 = canvas1.toDataURL('image/png', 1.0);
                
                // Yield to main thread
                await new Promise(resolve => setTimeout(resolve, 50));
                
                // Render second layout
                const canvas2 = await html2canvas(el2, {
                    scale: 1,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false,
                    width: 1080,
                    height: 1920,
                    windowWidth: 1080,
                    windowHeight: 1920
                });
                const dataUrl2 = canvas2.toDataURL('image/png', 1.0);
                
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

    // Photo upload handler
    const handlePhotoUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('photos[]', f));

        router.post(`/events/${event.event_id}/photos`, formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsUploading(false);
                if (photoInputRef.current) photoInputRef.current.value = '';
            },
            onError: () => {
                setIsUploading(false);
                alert('Upload failed.');
            }
        });
    };

    const handleDeletePhoto = (photoId) => {
        if (!confirm('Apakah kamu yakin ingin menghapus foto ini?')) return;
        router.delete(`/events/${event.event_id}/photos/${photoId}`, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedPhoto && selectedPhoto.id === photoId) {
                    const remaining = eventPhotos.filter(p => p.id !== photoId);
                    if (remaining.length > 0) {
                        setSelectedPhoto(remaining[0]);
                    } else {
                        setSelectedPhoto(null);
                        setIsPhotoFrameModalOpen(false);
                    }
                }
            }
        });
    };

    const loadImg = (url) => new Promise((resolve) => {
        const im = new window.Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => resolve(im);
        im.onerror = () => resolve(null);
        im.src = url;
    });

    // Shared drawFrame function for canvas preview & download matching Figma nodes 48-117 & 48-87
    const drawFrame = async (canvas, userImg, frameNum) => {
        if (!canvas) return;
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        const W = 1080, H = 1920;
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw user photo covering full canvas (object-cover)
        const imgRatio = userImg.width / userImg.height;
        const canvasRatio = W / H;
        let dW, dH, dX, dY;
        if (imgRatio > canvasRatio) {
            dH = H;
            dW = H * imgRatio;
            dX = (W - dW) / 2;
            dY = 0;
        } else {
            dW = W;
            dH = W / imgRatio;
            dX = 0;
            dY = (H - dH) / 2;
        }
        ctx.drawImage(userImg, dX, dY, dW, dH);

        // 2. Gradients overlay (exact Figma gradient matching Rectangles 21 and 22)
        const gradOverlay = await loadImg('/img/frames/frame_gradient_overlay.svg');
        if (gradOverlay) {
            ctx.drawImage(gradOverlay, 0, 0, W, H);
        } else {
            // Precise mathematical fallback matching Figma linearGradient definitions
            const topGrad = ctx.createLinearGradient(0, 1417.58, 0, -17);
            topGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            topGrad.addColorStop(0.389423, 'rgba(0, 0, 0, 0)');
            topGrad.addColorStop(0.798077, 'rgba(0, 0, 0, 1)');
            topGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
            ctx.fillStyle = topGrad;
            ctx.fillRect(0, 0, W, 974);

            const botGrad = ctx.createLinearGradient(0, 791.75, 0, 1973);
            botGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            botGrad.addColorStop(0.400649, 'rgba(0, 0, 0, 0)');
            botGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
            ctx.fillStyle = botGrad;
            ctx.fillRect(0, 1157, W, 1920 - 1157);
        }

        if (frameNum === 1) {
            // Frame 1: Today's Podium (node 51-111)
            const [whiteClub, goldClub, silverClub, bronzeClub, tdcLogo] = await Promise.all([
                loadImg('/img/frames/frame1_white_club.svg'),
                loadImg('/img/frames/frame1_gold_club.svg'),
                loadImg('/img/frames/frame1_silver_club.svg'),
                loadImg('/img/frames/frame1_bronze_club.svg'),
                loadImg('/img/frames/frame1_tdc_logo.svg'),
            ]);

            // Dark green box for "today's" (Rectangle 28: 318.24, 185.7, 277.52, 103.68)
            ctx.fillStyle = '#0d3127';
            ctx.fillRect(318.24, 185.7, 277.52, 103.68);

            // White tilted club icon behind "podium" badge (Node 51:115: 579, 118, 183.7, 194.88)
            if (whiteClub) {
                ctx.drawImage(whiteClub, 579, 118, 183.7, 194.9);
            }

            // Text "today’s" (Node 51:117: 64.36px 42dot Sans Medium, center 457, vertical center 237.5)
            ctx.fillStyle = '#ffffff';
            ctx.font = "500 64.4px '42dot Sans', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("today’s", 457, 237.5);

            // Lighter green box for "podium" (Rectangle 29: center 557.7, 328.2, rotated -5.14 deg)
            ctx.save();
            ctx.translate(557.7, 328.2);
            ctx.rotate(-5.137 * Math.PI / 180);
            ctx.fillStyle = '#087456';
            ctx.fillRect(-138.76, -51.84, 277.52, 103.68);

            // Text "podium" (Node 51:118)
            ctx.fillStyle = '#ffffff';
            ctx.font = "500 64.4px '42dot Sans', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("podium", 0, -2);
            ctx.restore();

            // Reset textBaseline
            ctx.textBaseline = 'alphabetic';

            // Table headers (Nodes 51:119 - 51:122)
            ctx.fillStyle = '#ffffff';
            ctx.font = "500 32px '42dot Sans', sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText("name", 207.5, 458);
            ctx.fillText("W-L", 700, 458);
            ctx.textAlign = 'left';
            ctx.fillText("+/-", 784, 458);
            ctx.fillText("points", 881, 458);

            // Sort results
            const sortedResults = participants ? [...participants].sort((a, b) => (a.finish || 99) - (b.finish || 99)) : [];
            const top3 = [sortedResults[0] || null, sortedResults[1] || null, sortedResults[2] || null];
            const barConfigs = [
                { bg: 'rgba(13, 49, 39, 0.85)', text: '#ffffff', club: goldClub, y: 483.1, iconX: 76.4 },
                { bg: 'rgba(242, 237, 227, 0.85)', text: '#17211d', club: silverClub, y: 557.1, iconX: 76.0 },
                { bg: 'rgba(242, 237, 227, 0.85)', text: '#17211d', club: bronzeClub, y: 631.1, iconX: 76.0 },
            ];

            barConfigs.forEach((cfg, idx) => {
                const r = top3[idx];
                ctx.fillStyle = cfg.bg;
                roundRect(ctx, 49, cfg.y, 982, 61, 30.5);
                ctx.fill();

                // Club icon
                if (cfg.club) {
                    ctx.drawImage(cfg.club, cfg.iconX, cfg.y + 17.8, 25.4, 25.4);
                }

                if (r) {
                    // Name
                    ctx.fillStyle = cfg.text;
                    ctx.font = "600 24px '42dot Sans', sans-serif";
                    ctx.textAlign = 'left';
                    ctx.fillText(r.name || '', 135, cfg.y + 40);

                    // W-L
                    ctx.font = "500 22px '42dot Sans', sans-serif";
                    ctx.textAlign = 'center';
                    ctx.fillText(`${r.wins || 0}-${r.losses || 0}`, 700, cfg.y + 40);

                    // +/-
                    ctx.textAlign = 'left';
                    ctx.fillText(`${(r.diff > 0 ? '+' : '')}${r.diff || 0}`, 784, cfg.y + 40);

                    // Points
                    ctx.font = "700 24px '42dot Sans', sans-serif";
                    ctx.textAlign = 'left';
                    ctx.fillText(`${r.placement_bonus || 0}`, 881, cfg.y + 40);
                }
            });

            // Bottom right logo & text (Node 51:129)
            if (tdcLogo) {
                ctx.drawImage(tdcLogo, 656, 1743, 38.85, 39.1);
            }
            ctx.fillStyle = '#e7dfcf';
            ctx.font = "bold 33.9px 'Playfair Display', serif";
            ctx.textAlign = 'left';
            ctx.fillText("THE DEUCE CLUB", 712.4, 1774);

        } else {
            // Frame 2: TDC Classic (node 24-53)
            const [deuceLogo, line1, line2, clubSmall] = await Promise.all([
                loadImg('/img/frames/frame2_deuce_logo.svg'),
                loadImg('/img/frames/frame2_line1.svg'),
                loadImg('/img/frames/frame2_line2.svg'),
                loadImg('/img/frames/frame2_club_small.svg'),
            ]);

            // Top Logo
            if (deuceLogo) {
                ctx.drawImage(deuceLogo, 424.8, 240, 230.4, 230.4);
            }

            const drawSpacedText = (text, x, y, letterSpacing, align = 'center') => {
                ctx.save();
                ctx.textAlign = 'left';
                let totalWidth = 0;
                const charWidths = [];
                for (let i = 0; i < text.length; i++) {
                    const w = ctx.measureText(text[i]).width;
                    charWidths.push(w);
                    totalWidth += w;
                    if (i < text.length - 1) totalWidth += letterSpacing;
                }
                let curX = align === 'center' ? x - totalWidth / 2 : (align === 'right' ? x - totalWidth : x);
                for (let i = 0; i < text.length; i++) {
                    ctx.fillText(text[i], curX, y);
                    curX += charWidths[i] + letterSpacing;
                }
                ctx.restore();
            };

            // Flanking lines 1
            if (line1) {
                ctx.drawImage(line1, 435.8, 483, 207.9, 1.95);
            }

            // "THE"
            ctx.fillStyle = '#e7dfcf';
            ctx.font = "normal 31.2px 'Playfair Display', serif";
            ctx.textAlign = 'center';
            ctx.fillText("THE", 540, 488);

            // "DEUCE"
            ctx.font = "normal 62.5px 'Playfair Display', serif";
            drawSpacedText("DEUCE", 540, 540, 24.99, 'center');

            // Flanking lines 2
            if (line2) {
                ctx.drawImage(line2, 411.2, 595, 257.7, 1.95);
            }

            // "CLUB"
            ctx.font = "normal 46.8px 'Playfair Display', serif";
            drawSpacedText("CLUB", 540, 598, 5.15, 'center');

            // Bottom Event Info
            if (clubSmall) {
                ctx.drawImage(clubSmall, 527.3, 1629, 25.4, 25.4);
            }

            // Format event date
            const eventDateStr = event.event_date 
                ? new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : '23 December 2026';

            // Line 1: [event date]
            ctx.fillStyle = '#f2ede3';
            ctx.font = "300 24px '42dot Sans', sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText(eventDateStr, 540, 1690);

            // Line 2: [event name]
            ctx.font = "500 24px '42dot Sans', sans-serif";
            ctx.fillText(event.event_name || 'Singles Social Point Play', 540, 1724);

            // Line 3: at [venue]
            const atStr = "at ";
            const venueStr = event.location || 'test';
            ctx.font = "300 24px '42dot Sans', sans-serif";
            const atW = ctx.measureText(atStr).width;
            ctx.font = "500 24px '42dot Sans', sans-serif";
            const venueW = ctx.measureText(venueStr).width;
            const totalW = atW + venueW;
            const startX = 540 - totalW / 2;

            ctx.textAlign = 'left';
            ctx.font = "300 24px '42dot Sans', sans-serif";
            ctx.fillText(atStr, startX, 1758);
            ctx.font = "500 24px '42dot Sans', sans-serif";
            ctx.fillText(venueStr, startX + atW, 1758);
        }
    };

    // Effect to render live preview on canvas when modal opens or frame/photo changes
    useEffect(() => {
        let isMounted = true;
        if (isPhotoFrameModalOpen && selectedPhoto && framedCanvasRef.current) {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = async () => {
                if (isMounted && framedCanvasRef.current) {
                    await drawFrame(framedCanvasRef.current, img, selectedFrame);
                }
            };
            img.src = selectedPhoto.url;
        }
        return () => { isMounted = false; };
    }, [isPhotoFrameModalOpen, selectedPhoto, selectedFrame]);

    // Generate framed photo for download
    const generateFramedPhoto = async (photoUrl, frameNum) => {
        setIsGeneratingFramed(true);
        try {
            const canvas = document.createElement('canvas');
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = photoUrl;
            });

            await drawFrame(canvas, img, frameNum);
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            
            if (navigator.canShare) {
                try {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], `TDC_${event.event_id}_frame${frameNum}.png`, { type: 'image/png' });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], title: 'The Deuce Club' });
                        setIsPhotoFrameModalOpen(false);
                        return;
                    }
                } catch (err) { /* fall through to download */ }
            }
            
            const link = document.createElement('a');
            link.download = `TDC_${event.event_id}_frame${frameNum}.png`;
            link.href = dataUrl;
            link.click();
            setIsPhotoFrameModalOpen(false);
        } catch (err) {
            console.error('Frame generation failed', err);
            alert('Failed to generate framed photo.');
        } finally {
            setIsGeneratingFramed(false);
        }
    };

    // Helper for rounded rectangles
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    const MAX_PLAYERS = 16;
    const checkedInCount = participants ? participants.length : 0;
    const targetSlots = Math.min(MAX_PLAYERS, Math.max(8, Math.ceil(checkedInCount / 2) * 2));
    const emptySlots = Math.max(0, targetSlots - checkedInCount);
    
    const teams = [1, 2, 3, 4];
    const groupedParticipants = {};
    if (isFixedPartner) {
        teams.forEach(t => groupedParticipants['Team ' + t] = []);
        if (participants) {
            participants.forEach(p => {
                if (p.team_name) {
                    if (!groupedParticipants[p.team_name]) groupedParticipants[p.team_name] = [];
                    groupedParticipants[p.team_name].push(p);
                }
            });
        }
    }

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
                    {isAdmin && (
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
                        
                        {!isFixedPartner ? (
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
                        ) : (
                            <div className="flex flex-col space-y-4 mb-2">
                                {teams.map(t => {
                                    const teamName = 'Team ' + t;
                                    const members = groupedParticipants[teamName] || [];
                                    return (
                                        <div key={t} className="flex flex-col space-y-2 bg-white/5 rounded-xl p-3 border border-white/10">
                                            <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{teamName}</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {members.map(p => (
                                                    <div key={p.result_id} className="bg-[#dfd6c5] text-[#1b2622] text-xs font-semibold py-1.5 rounded-full text-center flex items-center justify-center shadow-sm truncate px-2 relative group">
                                                        <span className="truncate">{p.name}</span>
                                                        {isEditMode && (
                                                            <button 
                                                                onClick={() => deleteParticipant(p.result_id)}
                                                                className="absolute right-1 w-5 h-5 bg-[#9c3232] text-white rounded-full flex items-center justify-center"
                                                            >
                                                                <Trash2 size={10} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                {[...Array(Math.max(0, 2 - members.length))].map((_, i) => (
                                                    <div key={`empty-${t}-${i}`} className="bg-[#dfd6c5]/10 text-[#dfd6c5]/40 border border-dashed border-[#dfd6c5]/20 text-[10px] font-medium py-1.5 rounded-full text-center flex items-center justify-center">
                                                        [slot available]
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        <div className="text-right text-[#dfd6c5] text-[9px] opacity-70 mt-3">
                            {checkedInCount} players already checked in
                        </div>

                        {/* Admin Action Buttons */}
                        {isAdmin && (
                            <div className="flex flex-col mt-8 border-t border-white/10 pt-8 space-y-4">
                                <div className="flex flex-col space-y-3">
                                    {!isFixedPartner ? (
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <button 
                                                    onClick={() => { setActiveQrTeam(null); setIsQrModalOpen(true); }}
                                                    className="bg-[#247c64] hover:bg-[#1e6854] text-white text-[10px] font-medium py-2.5 px-3 rounded-lg text-center shadow-sm flex-1 truncate transition-colors"
                                                >
                                                    [generate QR]
                                                </button>
                                                <button 
                                                    onClick={() => photoInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="bg-[#30453d] hover:bg-[#3d564d] text-[#dfd6c5] border border-white/20 text-[10px] font-medium py-2.5 px-2 rounded-lg text-center shadow-sm flex-1 truncate flex items-center justify-center space-x-1 disabled:opacity-50 transition-colors"
                                                >
                                                    <Camera size={13} className="shrink-0" />
                                                    <span>{isUploading ? 'Uploading...' : '[upload foto]'}</span>
                                                </button>
                                                {checkedInCount > 0 ? (
                                                    <button 
                                                        onClick={() => setIsSessionEndedModalOpen(true)}
                                                        className="bg-[#9c3232] hover:bg-[#822a2a] text-white text-[10px] font-medium py-2.5 px-3 rounded-lg text-center shadow-sm flex-1 truncate transition-colors"
                                                    >
                                                        [end session]
                                                    </button>
                                                ) : (
                                                    <div className="flex-1"></div>
                                                )}
                                            </div>
                                            <input 
                                                ref={photoInputRef}
                                                type="file" 
                                                accept="image/*" 
                                                multiple 
                                                className="hidden" 
                                                onChange={handlePhotoUpload}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-2">
                                                {teams.map(t => (
                                                    <button 
                                                        key={t}
                                                        onClick={() => { setActiveQrTeam(t); setIsQrModalOpen(true); }}
                                                        className="bg-[#247c64] text-white text-[9px] font-medium py-2 px-2 rounded-lg text-center shadow-sm uppercase"
                                                    >
                                                        [generate QR Team {t}]
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-2">
                                                <button 
                                                    onClick={() => photoInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="bg-[#30453d] hover:bg-[#3d564d] text-[#dfd6c5] border border-white/20 text-[10px] font-medium py-2 px-3 rounded-lg text-center shadow-sm flex-1 truncate flex items-center justify-center space-x-1.5 disabled:opacity-50"
                                                >
                                                    <Camera size={13} />
                                                    <span>{isUploading ? 'Uploading...' : '[upload foto]'}</span>
                                                </button>
                                                {checkedInCount > 0 && (
                                                    <button 
                                                        onClick={() => setIsSessionEndedModalOpen(true)}
                                                        className="bg-[#9c3232] text-white text-[10px] font-medium py-2 px-4 rounded-lg text-center shadow-sm flex-1 truncate"
                                                    >
                                                        [end session]
                                                    </button>
                                                )}
                                            </div>
                                            <input 
                                                ref={photoInputRef}
                                                type="file" 
                                                accept="image/*" 
                                                multiple 
                                                className="hidden" 
                                                onChange={handlePhotoUpload}
                                            />
                                        </>
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
                            
                            {!isFixedPartner ? (
                                finalResults.map((result) => {
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
                                })
                            ) : (
                                Object.values(finalResults.reduce((acc, result) => {
                                    if (result.team_name) {
                                        if (!acc[result.team_name]) acc[result.team_name] = [];
                                        acc[result.team_name].push(result);
                                    }
                                    return acc;
                                }, {})).sort((a, b) => (a[0]?.finish || 99) - (b[0]?.finish || 99)).map(members => {
                                    const firstRep = members[0];
                                    const rank = firstRep.finish;
                                    const isTop3 = rank <= 3;
                                    
                                    let clubColor = '#dfd6c5'; // default
                                    if (rank === 1) clubColor = '#d4af37'; // gold
                                    if (rank === 2) clubColor = '#c0c0c0'; // silver
                                    if (rank === 3) clubColor = '#cd7f32'; // bronze
                                    
                                    return (
                                        <div key={firstRep.team_name} className="flex items-center justify-between text-white text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center space-x-3 w-3/5 pr-2">
                                                {isTop3 ? (
                                                    <span className="text-xs font-bold w-4 text-center shrink-0" style={{ color: clubColor }}>♣</span>
                                                ) : (
                                                    <span className="text-[#dfd6c5] text-[10px] w-4 text-center shrink-0">{rank}{getFinishSuffix(rank)}</span>
                                                )}
                                                
                                                <div className="flex flex-col space-y-1 overflow-hidden">
                                                    <span className="text-white/40 text-[8px] font-bold uppercase tracking-wider leading-none">{firstRep.team_name}</span>
                                                    <span className={`${isTop3 ? 'font-semibold' : 'font-medium text-[#dfd6c5]'} text-xs leading-tight truncate`} style={{ color: isTop3 ? clubColor : undefined }}>
                                                        {members.map(m => m.name).join(' & ')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1 w-2/5 shrink-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[9px] text-white/50 font-mono tracking-tighter">
                                                        {firstRep.wins || 0}W {firstRep.losses || 0}L {(firstRep.diff && firstRep.diff > 0 ? '+' : '')}{firstRep.diff || 0}DIFF
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-xs ${isTop3 ? 'font-bold' : 'font-medium text-[#dfd6c5]'}`} style={{ color: isTop3 ? clubColor : undefined }}>
                                                        {firstRep.placement_bonus || 0} CP / plyr
                                                    </span>
                                                    {isAdmin && isEditMode && (
                                                        <button 
                                                            onClick={() => {
                                                                // Edit first rep
                                                                setEditingResult(firstRep);
                                                                setEditForm({
                                                                    wins: firstRep.wins !== null && firstRep.wins !== undefined ? firstRep.wins : '',
                                                                    losses: firstRep.losses !== null && firstRep.losses !== undefined ? firstRep.losses : '',
                                                                    diff: firstRep.diff !== null && firstRep.diff !== undefined ? firstRep.diff : '',
                                                                    finish: firstRep.finish !== null && firstRep.finish !== undefined ? firstRep.finish : ''
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
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        
                        {/* Action buttons: GENERATE SESSION RESULT & DOWNLOAD EVENT PHOTO side-by-side */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center w-full gap-3">
                            {loggedInResult && (
                                <button 
                                    onClick={() => handleDownloadGraphic(loggedInResult.result_id, loggedInResult.name)}
                                    disabled={downloadingId !== null}
                                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium uppercase tracking-widest py-3 px-6 rounded-full transition-colors disabled:opacity-50 border border-white/20"
                                >
                                    {downloadingId !== null ? 'GENERATING...' : 'GENERATE SESSION RESULT'}
                                </button>
                            )}

                            {eventPhotos.length > 0 && (
                                <button 
                                    onClick={() => {
                                        setSelectedPhoto(eventPhotos[0]);
                                        setIsPhotoFrameModalOpen(true);
                                    }}
                                    className="bg-[#247c64] hover:bg-[#1e6854] text-white text-[10px] font-medium uppercase tracking-widest py-3 px-6 rounded-full transition-colors border border-white/20 flex items-center space-x-2 shadow-lg"
                                >
                                    <Download size={14} />
                                    <span>DOWNLOAD EVENT PHOTO</span>
                                </button>
                            )}
                        </div>

                        {isAdmin && (
                            <div className="mt-3 flex justify-center">
                                <button 
                                    onClick={() => photoInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="text-[#dfd6c5]/70 hover:text-[#dfd6c5] text-[11px] font-medium flex items-center space-x-1.5 transition-colors"
                                >
                                    <Camera size={13} />
                                    <span>{isUploading ? 'Uploading...' : '[+ upload foto event]'}</span>
                                </button>
                                <input 
                                    ref={photoInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    className="hidden" 
                                    onChange={handlePhotoUpload}
                                />
                            </div>
                        )}

                        {/* Hidden Graphic for Generation */}
                        {loggedInResult && (
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
                        )}

                    </div>
                </>
            )}

            {/* Event Photos Gallery & Download with Frame */}
            {eventPhotos.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="text-white text-sm font-medium mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ImageIcon size={16} />
                            <span>Event Photos</span>
                            <span className="text-white/40 text-xs">({eventPhotos.length})</span>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => photoInputRef.current?.click()}
                                disabled={isUploading}
                                className="text-[#dfd6c5]/80 hover:text-[#dfd6c5] text-[11px] font-medium flex items-center space-x-1 transition-colors"
                            >
                                <Camera size={13} />
                                <span>{isUploading ? 'Uploading...' : '+ Upload Foto'}</span>
                            </button>
                        )}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {eventPhotos.map((photo) => (
                            <div 
                                key={photo.id} 
                                className="relative aspect-square rounded-xl overflow-hidden bg-white/5 cursor-pointer group"
                                onClick={() => { setSelectedPhoto(photo); setIsPhotoFrameModalOpen(true); }}
                            >
                                <img 
                                    src={photo.url} 
                                    alt={photo.filename} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-active:bg-black/30 transition-colors flex items-center justify-center">
                                    <Download size={20} className="text-white opacity-0 group-active:opacity-100 transition-opacity" />
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#9c3232] hover:bg-[#b83838] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 z-10"
                                        title="Hapus Foto"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
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
                                value={`${window.location.origin}/events/${event.event_id}/checkin?t=${qrToken}${activeQrTeam ? "&team="+activeQrTeam : ""}`} 
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
                            {!isFixedPartner ? (
                                participants && participants.map((p) => (
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
                                                type="number" min="0" placeholder="0"
                                                value={placements[p.result_id]?.wins !== undefined ? placements[p.result_id].wins : ''}
                                                onChange={(e) => handleResultChange(p.result_id, 'wins', e.target.value)}
                                                className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input 
                                                type="number" min="0" placeholder="0"
                                                value={placements[p.result_id]?.losses !== undefined ? placements[p.result_id].losses : ''}
                                                onChange={(e) => handleResultChange(p.result_id, 'losses', e.target.value)}
                                                className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input 
                                                type="number" placeholder="0"
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
                                                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                teams.filter(t => groupedParticipants['Team '+t] && groupedParticipants['Team '+t].length > 0).map(t => {
                                    const teamName = 'Team ' + t;
                                    const members = groupedParticipants[teamName];
                                    const firstRep = members[0];
                                    
                                    const handleTeamResultChange = (field, value) => {
                                        members.forEach(m => {
                                            handleResultChange(m.result_id, field, value);
                                        });
                                    };
                                    
                                    return (
                                        <div key={teamName} className="grid grid-cols-12 items-center gap-1 border-b border-white/5 pb-2">
                                            <div className="col-span-3 flex flex-col justify-center space-y-0.5 truncate pr-1">
                                                <div className="text-white/40 text-[8px] uppercase">{teamName}</div>
                                                <span className="text-white text-[9px] font-medium leading-tight break-words whitespace-normal">
                                                    {members.map(m => m.name).join(' & ')}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="number" min="0" placeholder="0"
                                                    value={placements[firstRep.result_id]?.wins !== undefined ? placements[firstRep.result_id].wins : ''}
                                                    onChange={(e) => handleTeamResultChange('wins', e.target.value)}
                                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="number" min="0" placeholder="0"
                                                    value={placements[firstRep.result_id]?.losses !== undefined ? placements[firstRep.result_id].losses : ''}
                                                    onChange={(e) => handleTeamResultChange('losses', e.target.value)}
                                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input 
                                                    type="number" placeholder="0"
                                                    value={placements[firstRep.result_id]?.diff !== undefined ? placements[firstRep.result_id].diff : ''}
                                                    onChange={(e) => handleTeamResultChange('diff', e.target.value)}
                                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50 text-center"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <select 
                                                    value={placements[firstRep.result_id]?.finish || ''}
                                                    onChange={(e) => handleTeamResultChange('finish', e.target.value)}
                                                    className="w-full bg-black/30 rounded border border-white/10 text-white text-xs py-1 px-1 focus:ring-1 focus:ring-white/50"
                                                >
                                                    <option value="">-</option>
                                                    {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
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

            {/* Photo Frame Selector & Download Modal */}
            {isPhotoFrameModalOpen && selectedPhoto && createPortal(
                <div className="fixed inset-0 z-[9999] flex flex-col bg-[#080d0a] text-white">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 pt-12 border-b border-white/10 shrink-0">
                        <button 
                            onClick={() => setIsPhotoFrameModalOpen(false)}
                            className="p-2 -ml-2 text-white/80 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-sm font-medium tracking-widest uppercase text-[#dfd6c5]">
                            Framed Event Photo
                        </h2>
                        {isAdmin && selectedPhoto ? (
                            <button
                                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                                className="flex items-center space-x-1.5 py-1 px-2.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 hover:text-white transition-colors text-[11px] font-medium"
                                title="Hapus foto ini"
                            >
                                <Trash2 size={13} />
                                <span>Hapus</span>
                            </button>
                        ) : (
                            <div className="w-8"></div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto hide-scrollbar max-w-md mx-auto w-full">
                        {/* Frame Toggle */}
                        <div className="grid grid-cols-2 gap-2 w-full mb-3 shrink-0">
                            <button
                                onClick={() => setSelectedFrame(1)}
                                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                                    selectedFrame === 1 
                                        ? 'bg-[#247c64] border-[#247c64] text-white shadow-lg' 
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                }`}
                            >
                                Frame 1: Podium
                            </button>
                            <button
                                onClick={() => setSelectedFrame(2)}
                                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                                    selectedFrame === 2 
                                        ? 'bg-[#247c64] border-[#247c64] text-white shadow-lg' 
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                }`}
                            >
                                Frame 2: TDC Classic
                            </button>
                        </div>

                        {/* Photo Switcher (if multiple) */}
                        {eventPhotos.length > 1 && (
                            <div className="w-full mb-3 shrink-0">
                                <span className="text-[10px] text-[#dfd6c5]/70 mb-1 block uppercase tracking-wider">Choose Photo:</span>
                                <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
                                    {eventPhotos.map((p) => (
                                        <div key={p.id} className="relative shrink-0 pt-1 pr-1">
                                            <img
                                                src={p.url}
                                                alt="thumb"
                                                onClick={() => setSelectedPhoto(p)}
                                                className={`w-12 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                                                    selectedPhoto?.id === p.id ? 'border-[#d4af37] scale-105 shadow-md' : 'border-white/10 opacity-60'
                                                }`}
                                            />
                                            {isAdmin && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(p.id); }}
                                                    className="absolute top-0 right-0 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] shadow-md z-10"
                                                    title="Hapus foto ini"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Live Canvas Preview */}
                        <div className="w-full max-w-[270px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 my-1 flex items-center justify-center shrink-0">
                            <canvas 
                                ref={framedCanvasRef} 
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Download CTA */}
                        <div className="w-full mt-4 pb-8 shrink-0">
                            <button
                                onClick={() => generateFramedPhoto(selectedPhoto.url, selectedFrame)}
                                disabled={isGeneratingFramed}
                                className="w-full bg-[#d4af37] hover:bg-[#c09d31] text-black font-semibold py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 text-xs tracking-wider uppercase"
                            >
                                <Download size={16} />
                                <span>{isGeneratingFramed ? 'GENERATING...' : 'DOWNLOAD FRAMED PHOTO'}</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
