'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Trophy, ChevronRight, Instagram, Twitter,
    QrCode, User, Mail, School, ShieldCheck, Map
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'

// --- CLEAN ADVENTURE COMPONENTS ---

const TorchIcon = () => (
    <div className="flex flex-col items-center">
        <div className="text-xl torch-flame-subtle">🔥</div>
        <div className="w-1.5 h-6 bg-gradient-to-b from-[#5c4033] to-[#2b1b12] rounded-sm" />
    </div>
)

const LeafDecoration = ({ side }: { side: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const positions = {
        tl: "-top-3 -left-3 rotate-0",
        tr: "-top-3 -right-3 rotate-90",
        bl: "-bottom-3 -left-3 -rotate-90",
        br: "-bottom-3 -right-3 rotate-180"
    }
    return (
        <div className={`absolute z-20 pointer-events-none scale-100 ${positions[side]}`}>
            <svg width="40" height="40" viewBox="0 0 100 100">
                <path d="M10 90 Q 20 60, 40 50 Q 60 40, 70 20" stroke="#3d5a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
                <ellipse cx="40" cy="50" rx="16" ry="8" fill="#5a7d2e" transform="rotate(-35 40 50)" />
                <ellipse cx="65" cy="25" rx="14" ry="7" fill="#4d6b27" transform="rotate(-50 65 25)" />
            </svg>
        </div>
    )
}

const AdventureCard = ({ title, children, hasTorches = false, className = "" }: any) => (
    <div className={`relative ${className} mb-12`}>
        {/* Banner */}
        <div className="adventure-banner">
            {title}
        </div>

        {/* Card Body */}
        <div className="adventure-card-container p-8 pt-12">
            <LeafDecoration side="tl" />
            <LeafDecoration side="br" />

            {hasTorches && (
                <>
                    <div className="absolute top-[-10px] left-4"><TorchIcon /></div>
                    <div className="absolute top-[-10px] right-4"><TorchIcon /></div>
                </>
            )}

            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    </div>
)

const AdventureInput = ({ label, value }: { label: string, value: string }) => (
    <div className="adventure-input-row">
        <label className="adventure-label">{label}:</label>
        <div className="adventure-value-box truncate">
            {value || "---"}
        </div>
    </div>
)

export default function ProfilePage() {
    const { userData, logout, isLoggedIn } = useApp()
    const router = useRouter()

    if (!isLoggedIn || !userData) {
        if (typeof window !== 'undefined') router.push('/login')
        return null
    }

    return (
        <main
            className="min-h-screen pt-40 pb-20 px-6 relative bg-fixed bg-center bg-cover flex flex-col items-center overflow-x-hidden"
            style={{ backgroundImage: 'url("/temp/adventure-bg.jpeg")' }}
        >
            {/* Dark Overlay for proper contrast */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start justify-center">

                    {/* LEFT - PRIMARY DATA */}
                    <div className="lg:col-span-12 xl:col-span-7 w-full flex flex-col items-center">
                        <AdventureCard title="USER PROFILE" hasTorches={true} className="w-full">
                            <div className="flex flex-col items-center">

                                {/* Avatar */}
                                <div className="relative mb-8 mt-4">
                                    <div className="w-40 h-40 rounded-full border-[6px] border-[#8b7355] overflow-hidden shadow-xl bg-[#c8bc9f]">
                                        <img
                                            src={userData.avatar}
                                            alt="Identity"
                                            className="w-full h-full object-cover grayscale brightness-105"
                                        />
                                    </div>
                                    {/* Compass marks around avatar */}
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="absolute w-1.5 h-4 bg-[#8b7355] rounded-full"
                                            style={{
                                                top: '50%', left: '50%',
                                                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-92px)`
                                            }} />
                                    ))}
                                </div>

                                <h3 className="font-display text-[#3d3220] text-lg font-bold tracking-[2px] mb-8 uppercase text-center w-full border-b border-[#8b7355]/20 pb-4">
                                    ACCOUNT DETAILS
                                </h3>

                                <div className="w-full space-y-2 mb-10 px-4">
                                    <AdventureInput label="Username" value={userData.name} />
                                    <AdventureInput label="Email" value={userData.email} />
                                    <AdventureInput label="College" value={userData.collegeName} />
                                    <AdventureInput label="Status" value={userData.hasPaid ? "VERIFIED ACCESS" : "AUTHORIZATION PENDING"} />
                                </div>

                                <div className="flex gap-4 w-full justify-center mb-8">
                                    <button className="adventure-button-primary flex-1 max-w-[180px]">SAVE CHANGES</button>
                                    <button
                                        onClick={() => { logout(); router.push('/'); }}
                                        className="adventure-button-primary flex-1 max-w-[180px] bg-[#6b6b63]"
                                    >LOGOUT</button>
                                </div>

                                {/* Bio Block */}
                                <div className="w-full text-left bg-black/5 p-6 rounded-lg border border-[#8b7355]/20">
                                    <h4 className="font-display text-[#3d3220]/60 text-[11px] font-bold uppercase mb-3 tracking-[2px]">
                                        CHARACTER BIO.
                                    </h4>
                                    <div className="text-[#3d3220] italic text-sm leading-relaxed font-body">
                                        About Me: <br />
                                        Identity Profile Code: {userData.profileCode || "N/A"}.
                                        Authenticated explorer of the Varnothsava cycle. All mission data and clearance records are secured within the archival server.
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-8 mt-10">
                                    {[Instagram, Twitter].map((Icon, i) => (
                                        <div key={i} className="p-2 border-2 border-[#8b7355] rounded-full text-[#3d3220] hover:bg-[#8b7355] hover:text-[#f2e8cf] transition-all cursor-pointer">
                                            <Icon size={24} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AdventureCard>
                    </div>

                    {/* RIGHT - MISSION MODES */}
                    <div className="lg:col-span-12 xl:col-span-5 w-full flex flex-col gap-8">

                        <AdventureCard title="RECENT ACTIVITY" className="w-full">
                            <div className="space-y-4 py-4 px-2">
                                {!userData.registeredEvents?.length ? (
                                    <div className="text-center italic opacity-30 text-sm py-12">No recent expeditions loged...</div>
                                ) : (
                                    userData.registeredEvents.map((ev, i) => (
                                        <div key={i} className="flex items-center gap-4 border-b border-[#8b7355]/10 pb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#8b8b83] flex items-center justify-center text-white">
                                                <Trophy size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-[#3d3220] uppercase">{ev.id.replace(/-/g, ' ')}</div>
                                                <div className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Party: {ev.teamName}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <button
                                    onClick={() => router.push('/events')}
                                    className="w-full mt-4 text-xs font-display font-bold underline opacity-40 hover:opacity-100 transition-all text-center uppercase tracking-widest"
                                >
                                    OPEN EXPEDITION MAP
                                </button>
                            </div>
                        </AdventureCard>

                        <AdventureCard title="ACCESS KEY" className="w-full">
                            <div className="flex flex-col items-center gap-6 py-6 font-display">
                                <div className="p-4 bg-white border-4 border-[#8b7355] shadow-xl rotate-1">
                                    <QrCode size={150} className="text-[#322a20]" />
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold text-[#3d3220] tracking-[2px] uppercase mb-1">STATION IDENTITY VERIFIED</div>
                                    <div className="text-[10px] opacity-40 uppercase tracking-[2px]">SCAN KEY FOR ENTRY</div>
                                </div>
                            </div>
                        </AdventureCard>

                    </div>
                </div>
            </div>
        </main>
    )
}
