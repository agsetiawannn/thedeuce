import { Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Login() {
    const { errors } = usePage().props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Normal email/password login logic would go here
    };

    return (
        <>
            <Head title="Log in" />

            {/* Logo */}
            <div className="flex justify-center mt-6 md:mt-14 shrink-0">
                <img src="/img/full_logo.png" alt="The Deuce Club" className="w-40 h-auto opacity-90" />
            </div>

            {/* Login Form Container */}
            <div className="flex-1 flex items-center justify-center w-full mt-8 mb-8">
                <div className="w-full border border-[#dfd6c5] rounded-[1.5rem] p-6 backdrop-blur-sm bg-black/10">
                    <div className="flex flex-col space-y-6">
                        {errors.error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl text-center">
                                {errors.error}
                            </div>
                        )}

                        <div className="text-center text-[#dfd6c5] text-sm mb-4">
                            Welcome to The Deuce Club
                        </div>

                        {/* Google Login Button */}
                        <a
                            href="/auth/google/redirect"
                            className="flex items-center justify-center space-x-2 w-full bg-[#dfd6c5] text-[#1b2622] py-3 rounded-md font-medium text-sm transition-transform active:scale-95"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            <span>Continue with Google</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center space-x-1.5 text-[#dfd6c5] mt-auto pb-4 shrink-0 opacity-80 uppercase tracking-widest text-[10px]">
                <span style={{ fontFamily: "'Playfair Display', serif" }}>THE DEUCE</span>
                <img src="/img/Group 35.png" alt="star" className="w-2.5 h-2.5 opacity-90" />
                <span style={{ fontFamily: "'Playfair Display', serif" }}>CLUB</span>
                <span style={{ fontFamily: "'Lato', sans-serif" }} className="ml-1">© 2026</span>
            </div>
        </>
    );
}
