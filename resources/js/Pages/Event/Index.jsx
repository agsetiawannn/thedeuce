import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, ChevronRight, X, Trash2 } from 'lucide-react';

export default function EventIndex({ auth, events }) {
    const allowedEmails = ['anandazhou09@gmail.com', 'idabagusadhya@gmail.com', 'abiseka33@gmail.com', 'setiawan18221@gmail.com'];
    const isAdmin = auth?.user?.email && allowedEmails.includes(auth.user.email.toLowerCase());

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        event_name: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        kuyy_link: '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        transform((data) => ({
            ...data,
            event_time: `${data.start_time} - ${data.end_time}`
        }));
        
        post('/events', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen w-full relative pb-28">
            <Head title="Event List - The Deuce Club" />

            {/* Header */}
            <div className="pt-4 pb-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-white text-xl font-medium">Event List</h1>
                    {/* Admin Add Event Button */}
                    {isAdmin && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/10 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center shadow-sm"
                        >
                            + Add Event
                        </button>
                    )}
                </div>
                {events && events.length > 0 && (
                    <h2 className="text-[#dfd6c5] text-lg font-medium">Upcoming Event</h2>
                )}
            </div>

            {/* Event List */}
            <div className="flex flex-col space-y-5">
                {events && events.length > 0 ? events.map((event) => (
                    <div key={event.event_id} className="flex justify-between items-center border-b border-white/10 pb-6 pt-2">
                        <div className="flex flex-col flex-1 pr-4">
                            {/* Title row */}
                            <div className="flex items-start space-x-2 mb-3">
                                <span className="text-white text-lg leading-tight mt-[1px]">♣</span>
                                <h3 className="text-white text-base font-bold leading-tight tracking-wide">
                                    {new Date(event.event_date).toLocaleDateString('en-GB', { weekday: 'short' })} | {event.event_name}
                                </h3>
                            </div>
                            
                            {/* Meta rows */}
                            <div className="flex flex-col pl-6 space-y-2 text-[#dfd6c5] text-[12px] font-medium tracking-wide">
                                <div className="flex items-center space-x-2">
                                    <Calendar size={14} strokeWidth={2.5} className="opacity-90 shrink-0" />
                                    <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock size={14} strokeWidth={2.5} className="opacity-90 shrink-0" />
                                    <span>{event.event_time || 'TBA'}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <MapPin size={14} strokeWidth={2.5} className="shrink-0 mt-[2px] opacity-90" />
                                    <span className="leading-snug">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Link 
                                href={`/events/${event.event_id}`} 
                                className="bg-[#dfd6c5] text-[#1b2622] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center justify-center space-x-1 shadow-sm w-full"
                            >
                                <span>view details</span>
                                <ChevronRight size={12} strokeWidth={3} />
                            </Link>
                            {isAdmin && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this event? If the event has ended, deleting it will also REMOVE the points and stats (wins/losses) gained by the participants in this event.')) {
                                            router.delete(`/events/${event.event_id}`);
                                        }
                                    }}
                                    className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center justify-center space-x-1 shadow-sm w-full transition-colors hover:bg-red-500/20"
                                >
                                    <Trash2 size={12} strokeWidth={2.5} />
                                    <span>delete</span>
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="text-white text-center py-8 opacity-60">No upcoming events found.</div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-start space-x-1.5 text-[#dfd6c5] mt-4 mb-28 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm min-h-[100dvh]">
                    <div className="bg-[#0c1410] border border-white/10 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        
                        <h2 className="text-white text-lg font-medium mb-6">Add New Event</h2>
                        
                        <form onSubmit={submit} className="flex flex-col space-y-4">
                            <div>
                                <label className="text-white/60 text-xs mb-1 block">Event Name</label>
                                <div className="relative">
                                    <select 
                                        value={data.event_name}
                                        onChange={e => setData('event_name', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] min-h-[44px] appearance-none"
                                        required
                                    >
                                        <option value="" disabled className="text-gray-500">Select Event Name</option>
                                        <option value="Singles Intense Point Play" className="text-black">Singles Intense Point Play</option>
                                        <option value="Singles Social Point Play" className="text-black">Singles Social Point Play</option>
                                        <option value="Mixed Doubles/Doubles Social Point Play" className="text-black">Mixed Doubles/Doubles Social Point Play</option>
                                        <option value="Mixed Doubles/Doubles Intense Point Play" className="text-black">Mixed Doubles/Doubles Intense Point Play</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.event_name && <span className="text-red-400 text-[10px] mt-1">{errors.event_name}</span>}
                            </div>
                            
                            <div className="mb-4">
                                <label className="text-white/60 text-xs mb-1 block">Date</label>
                                <input 
                                    type="date" 
                                    value={data.event_date}
                                    onChange={e => setData('event_date', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] min-h-[44px] appearance-none"
                                    required
                                />
                                {errors.event_date && <span className="text-red-400 text-[10px] mt-1">{errors.event_date}</span>}
                            </div>
                            
                            <div className="mb-4">
                                <label className="text-white/60 text-xs mb-1 block">Time (Start - End)</label>
                                <div className="flex items-center space-x-3 w-full">
                                    <input 
                                        type="time" 
                                        value={data.start_time}
                                        onChange={e => setData('start_time', e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] min-h-[44px] appearance-none"
                                        required
                                    />
                                    <span className="text-white/50 text-sm font-medium">-</span>
                                    <input 
                                        type="time" 
                                        value={data.end_time}
                                        onChange={e => setData('end_time', e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] min-h-[44px] appearance-none"
                                        required
                                    />
                                </div>
                                {errors.event_time && <span className="text-red-400 text-[10px] mt-1">{errors.event_time}</span>}
                            </div>
                            
                            <div className="mb-6">
                                <label className="text-white/60 text-xs mb-1 block">Location</label>
                                <input 
                                    type="text" 
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="e.g. LIGA Tennis Sanur"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] min-h-[44px]"
                                    required
                                />
                                {errors.location && <span className="text-red-400 text-[10px] mt-1">{errors.location}</span>}
                            </div>
                            
                            <div>
                                <label className="text-white/60 text-xs mb-1 block">Kuyy! App Link <span className="opacity-50 text-[10px]">(Optional)</span></label>
                                <input 
                                    type="url" 
                                    value={data.kuyy_link || ''}
                                    onChange={e => setData('kuyy_link', e.target.value)}
                                    placeholder="e.g. https://kuyy.app/..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] min-h-[44px]"
                                />
                                {errors.kuyy_link && <span className="text-red-400 text-[10px] mt-1">{errors.kuyy_link}</span>}
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa8323] text-[#1a1407] font-semibold rounded-xl py-3 mt-4"
                            >
                                {processing ? 'Adding...' : 'Add Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
