'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { X, Activity, MousePointer2, Zap, Rocket, Globe, ShoppingCart, Users, Clock } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { CosmicBackground } from '@/components/ui/CosmicBackground'

interface Mission {
    id: string
    title: string
    type: 'Technical' | 'Cultural'
    description: string
    rules: string[]
    prizePool: string
    coordinators: string[]
    fee: number
    visual: string
    date: string
    specs: string[]
}

const missions: Mission[] = [
    {
        id: 't1',
        title: 'NATIONAL GEO-AI HACKATHON',
        type: 'Technical',
        description: 'Advanced geospatial AI challenge. Solve real-world navigation problems using neural networks in the green sector.',
        rules: ['24h hackathon', 'Team of 2-4'],
        prizePool: 'INR 1.5L',
        coordinators: ['Rohan S.'],
        fee: 300,
        visual: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000',
        date: 'MAR 24',
        specs: ['AI', 'GREEN_GEO', 'SYNERGY']
    },
    {
        id: 't2',
        title: 'FINAGENT HACKATHON',
        type: 'Technical',
        description: 'Autonomous AI agents in finance. Building the next generation of sustainable economic models.',
        rules: ['Hybrid mode', 'Jio Finance'],
        prizePool: 'INR 1L',
        coordinators: ['Vikas'],
        fee: 250,
        visual: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=1000',
        date: 'MAR 26',
        specs: ['SUSTAIN', 'AGENTS', 'WEB3']
    },
    {
        id: 't3',
        title: 'INTEGRATION CHALLENGE',
        type: 'Technical',
        description: 'Real-time hardware logic battle. Integrate ecological systems in high-gravity scenarios.',
        rules: ['IMC Sponsored', 'Hardware provided'],
        prizePool: 'INR 3L',
        coordinators: ['Arjun'],
        fee: 500,
        visual: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000',
        date: 'MAR 27',
        specs: ['ECO_CORE', 'LOGIC', 'DYNAMIC']
    },
    {
        id: 't4',
        title: 'ZERVE DATATHON',
        type: 'Technical',
        description: 'Large scale sustainable data analysis. Uncover patterns in the planetary data streams.',
        rules: ['Cloud credits', 'Zerve API'],
        prizePool: 'INR 1.5L',
        coordinators: ['Karan'],
        fee: 200,
        visual: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=1000',
        date: 'MAR 28',
        specs: ['BIODATA', 'STREAM', 'ANALYTIC']
    }
]

export function EventGrid() {
    const [selected, setSelected] = useState<Mission | null>(null)
    const [filter, setFilter] = useState<'All' | 'Technical' | 'Cultural'>('All')
    const { addToCart, cart } = useApp()

    const filtered = missions.filter(m => filter === 'All' || m.type === filter)

    const complexClip = `polygon(
        30px 0, 100% 0, 
        100% 100%, 
        70% 100%, 65% 94%, 35% 94%, 30% 100%, 
        0 100%, 
        0 60%, 10px 60%, 10px 40%, 0 40%, 
        0 30px
    )`

    return (
        <section className="relative min-h-screen py-24 px-6 bg-[#050805]">
            <CosmicBackground />
            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Header - Green Accents */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
                    <div className="space-y-4 text-center md:text-left">
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="flex items-center gap-3 text-emerald-400 font-mono text-[9px] uppercase tracking-[0.5em] font-black"
                        >
                            <Activity className="w-4 h-4" />
                            <span>EVENT_FEED // LIVE_SYNC</span>
                        </motion.div>
                        <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
                            EVENT<br /><span className="text-emerald-500/30 not-italic">.CATEGORIES_</span>
                        </h2>
                    </div>

                    <div className="flex bg-white/5 p-1.5 rounded-sm border border-emerald-500/20 backdrop-blur-md">
                        {['All', 'Technical', 'Cultural'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t as any)}
                                className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-white/30 hover:text-white'
                                    }`}
                                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* The Geometric Green Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.map((mission, idx) => (
                        <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            layoutId={`card-${mission.id}`}
                        >
                            <Tilt
                                tiltMaxAngleX={3}
                                tiltMaxAngleY={3}
                                scale={1.02}
                                className="h-[440px] w-full"
                            >
                                <div className="w-full h-full relative group cursor-pointer" onClick={() => setSelected(mission)}>
                                    {/* GEOMETRIC SVG BORDER SYSTEM - Fixed Border Continuity */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none" viewBox="0 0 300 440">
                                        <defs>
                                            <filter id="glow-white" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="4" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>
                                        <path
                                            d="M 30 0 L 300 0 L 300 440 L 210 440 L 195 414 L 105 414 L 90 440 L 0 440 L 0 264 L 14 264 L 14 176 L 0 176 L 0 30 Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-white/70 group-hover:text-white transition-colors duration-500"
                                            style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}
                                        />
                                    </svg>

                                    {/* RADAR SWEEP SECTOR - Clipped Area */}
                                    <div
                                        className="absolute inset-[2px] overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                                        style={{ clipPath: complexClip }}
                                    >
                                        <div className="radar-sweep-line animate-radar-sweep" />
                                    </div>

                                    {/* INNER BORDER SVG */}
                                    <svg className="absolute inset-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 280 420">
                                        <path
                                            d="M 28 0 L 280 0 L 280 420 L 196 420 L 182 394.8 L 98 394.8 L 84 420 L 0 420 L 0 252 L 13 252 L 13 168 L 0 168 L 0 28 Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            className="text-emerald-500/40 group-hover:text-emerald-500/90 transition-colors duration-500"
                                        />
                                    </svg>

                                    {/* INTERNAL CONTAINER - THE COCKPIT VIEW (Brighter & Reactive) */}
                                    <div
                                        className="absolute inset-[12px] bg-[#030703] flex flex-col overflow-hidden group-hover:bg-[#051005] transition-colors duration-700"
                                        style={{ clipPath: complexClip }}
                                    >
                                        {/* Internal HUD Tech Pulse - Continuous Animation */}
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                                            {/* Brighter Tech Pulse Hearth */}
                                            <div className="absolute inset-x-4 top-10 bottom-20 bg-emerald-400/10 blur-[50px] animate-tech-pulse" />

                                            {/* Dynamic Scan Overlay */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:100%_3px] opacity-30" />
                                        </div>

                                        {/* Scanning Shine Effect (Accelerated on hover) */}
                                        <div className="scanning-shine group-hover:animate-[shine_1.5s_infinite]" />

                                        {/* Side Technical Decal */}
                                        <div className="absolute top-[35%] bottom-[35%] left-0 w-[14px] flex items-center justify-center bg-emerald-500/10 group-hover:bg-emerald-500/30 transition-colors z-20 border-r border-emerald-500/20">
                                            <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] font-black tracking-[0.4em] text-emerald-400/40 uppercase group-hover:text-emerald-400 transition-colors">
                                                MISSION_UNIT_{idx + 1}
                                            </span>
                                        </div>

                                        {/* HUD Corner Decals */}
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <div className="w-1 h-1 bg-emerald-500" />
                                            <div className="w-4 h-1 bg-emerald-500" />
                                        </div>

                                        <div className="pt-10 px-8 text-center z-10 relative">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-[7px] font-black text-emerald-500/40 tracking-[0.5em] group-hover:text-emerald-500 transition-colors">ID: {mission.id}</div>
                                                <div className="text-[7px] font-black text-white/20 tracking-[0.2em] px-2 py-0.5 border border-white/5 rounded-full uppercase group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all">
                                                    {mission.type}_UNIT
                                                </div>
                                            </div>
                                            <h3 className="text-[14px] font-black uppercase text-white tracking-[0.05em] italic group-hover:text-emerald-400 transition-colors leading-tight">
                                                {mission.title}
                                            </h3>
                                        </div>

                                        <div
                                            className="flex-1 mx-8 mt-6 mb-4 relative overflow-hidden bg-white/5 border border-white/10 group-hover:border-emerald-500/30 transition-all duration-700 z-10"
                                            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}
                                        >
                                            <img
                                                src={mission.visual}
                                                alt={mission.title}
                                                className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-90 group-hover:grayscale-0 scale-110 group-hover:scale-125 transition-all duration-[2000ms]"
                                            />
                                            {/* Tactical Overlays */}
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,5,0.8)_100%)]" />

                                            {/* Targeting Crosshair - On Hover */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-emerald-500/30 rounded-full animate-ping" />
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full" />
                                                <div className="absolute top-4 left-4 text-[6px] font-mono text-emerald-500/60 uppercase">LOCK_ON_SYNC</div>
                                            </div>

                                            <div className="absolute inset-x-0 top-0 h-[1px] bg-emerald-500/20 group-hover:h-[2px] transition-all" />
                                        </div>

                                        {/* New Data Readouts Block */}
                                        <div className="px-8 pb-4 flex justify-between items-center z-10">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">EST_DATE</span>
                                                <span className="text-[9px] font-black text-emerald-400/80 italic">{mission.date}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5">
                                                <span className="text-[6px] font-black text-white/20 uppercase tracking-widest">PRIZE_POOL</span>
                                                <span className="text-[9px] font-black text-white italic">{mission.prizePool}</span>
                                            </div>
                                        </div>

                                        <div className="px-10 pb-4 text-center">
                                            <p className="text-[9px] text-white/30 font-medium uppercase tracking-tight line-clamp-2 leading-relaxed group-hover:text-white/60 transition-colors">
                                                {mission.description}
                                            </p>
                                        </div>

                                        {/* Spec Tags Block */}
                                        <div className="px-10 pb-6 flex flex-wrap justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                            {mission.specs.map(spec => (
                                                <span key={spec} className="text-[6px] font-black text-emerald-500/60 tracking-widest px-1.5 py-0.5 border border-emerald-500/10 uppercase">
                                                    #{spec}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="px-8 pb-10 z-10 mt-auto">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCart(mission as any); }}
                                                    className={`flex-[2] py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${cart.find(c => c.id === mission.id)
                                                        ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                                        : 'bg-white/5 border-white/10 text-white/30 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                                                        }`}
                                                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}
                                                >
                                                    {cart.find(c => c.id === mission.id) ? 'READY' : 'SELECT_MNVR'}
                                                </button>
                                                <div
                                                    className="flex-1 py-3 text-[10px] font-black uppercase tracking-tight bg-white/10 text-white border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"
                                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
                                                >
                                                    ₹{mission.fee}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Sensor Bar */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 items-center opacity-30 group-hover:opacity-100 transition-all">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                            <div className="w-12 h-[1px] bg-emerald-500/20" />
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </Tilt>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal - Green Sync Layout */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 bg-black/95 z-[600] backdrop-blur-xl"
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-6 z-[700] pointer-events-none">
                            <motion.div
                                layoutId={`card-${selected.id}`}
                                className="w-full max-w-4xl bg-[#050805] border border-emerald-500/30 pointer-events-auto flex flex-col md:flex-row shadow-3xl overflow-hidden"
                                style={{ clipPath: 'polygon(30px 0, 100% 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)' }}
                            >
                                <div className="w-full md:w-1/2 h-80 md:h-auto relative bg-black">
                                    <img src={selected.visual} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050805] via-transparent to-transparent" />
                                    <div className="absolute top-10 left-10 p-4 border-l-2 border-emerald-400">
                                        <div className="text-[9px] font-black text-emerald-400 tracking-[0.3em] uppercase mb-2">TARGET_MODULE</div>
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase">{selected.title}</div>
                                    </div>
                                </div>

                                <div className="flex-1 p-10 md:p-16 overflow-y-auto bg-[#050805]">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black text-white/30 tracking-widest uppercase mb-4">LOG_ENTRY // ECO_DESCRIPTION</div>
                                            <p className="text-white/50 text-base leading-relaxed font-light italic">"{selected.description}"</p>
                                        </div>
                                        <button onClick={() => setSelected(null)} className="p-2 border border-white/20 hover:border-emerald-500 transition-all group">
                                            <X className="w-6 h-6 text-white/40 group-hover:text-emerald-500" />
                                        </button>
                                    </div>

                                    <div className="grid gap-10 pt-10 border-t border-white/10">
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-3 text-emerald-400 font-black text-[9px] uppercase tracking-widest">
                                                <Zap className="w-4 h-4" /> Participation_Directives
                                            </h4>
                                            <div className="grid gap-3">
                                                {selected.rules.map((rule, i) => (
                                                    <div key={i} className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                        {rule}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-10 border-t border-white/10">
                                            <div>
                                                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">ECO_CREDITS</div>
                                                <div className="text-4xl font-black text-white italic tracking-tighter italic">₹{selected.fee}</div>
                                            </div>
                                            <button
                                                onClick={() => { addToCart(selected as any); setSelected(null); }}
                                                className="bg-emerald-600 text-white px-12 py-4 font-black text-[11px] hover:bg-emerald-500 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                                            >
                                                SYNC_TO_PROFILE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    )
}
