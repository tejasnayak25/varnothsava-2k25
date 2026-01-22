'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import {
    Sparkles, Trophy, Target, Users, Award,
    CheckCircle2, Cpu, Palette, Gamepad2,
    Music
} from 'lucide-react'
import Lenis from 'lenis'

// --- High-End Cinematic Frame Sequence Component ---

const CinematicSequence = ({ progress, xOffset, scaleRatio }: { progress: any, xOffset: any, scaleRatio: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const images = useRef<HTMLImageElement[]>([])
    const frameCount = 40
    const [loaded, setLoaded] = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)

    useEffect(() => {
        let loadedCount = 0
        const loadImages = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image()
                img.src = `/sequence/ezgif-frame-${String(i).padStart(3, '0')}.jpg`
                img.onload = () => {
                    loadedCount++
                    setLoadProgress(Math.floor((loadedCount / frameCount) * 100))
                    if (loadedCount === frameCount) {
                        setLoaded(true)
                    }
                }
                images.current[i - 1] = img
            }
        }
        loadImages()
    }, [])

    useEffect(() => {
        if (!loaded || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const render = (val: number) => {
            const index = Math.min(
                frameCount - 1,
                Math.floor(val * (frameCount - 1))
            )
            const img = images.current[index]
            if (img && ctx) {
                const canvasAspect = canvas.width / canvas.height
                const imgAspect = img.width / img.height

                let drawWidth, drawHeight, offsetX, offsetY

                if (canvasAspect > imgAspect) {
                    drawHeight = canvas.height
                    drawWidth = drawHeight * imgAspect
                } else {
                    drawWidth = canvas.width
                    drawHeight = drawWidth / imgAspect
                }

                offsetX = (canvas.width - drawWidth) / 2
                offsetY = (canvas.height - drawHeight) / 2

                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, drawWidth, drawHeight)
            }
        }

        render(progress.get())
        const unsubscribe = progress.on('change', render)
        return () => unsubscribe()
    }, [loaded, progress])

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <motion.div
                style={{ x: xOffset, scale: scaleRatio }}
                className="gpu-accel relative w-full h-full max-w-7xl max-h-[80dvh] flex items-center justify-center"
            >
                <canvas
                    ref={canvasRef}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_80px_rgba(16,185,129,0.15)] aspect-video"
                />
                <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full -z-10 animate-pulse" />
            </motion.div>

            <AnimatePresence>
                {!loaded && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6"
                    >
                        <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                            <motion.div
                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadProgress}%` }}
                            />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.6em] text-emerald-500 font-bold text-center">Preparing the fest experience... {loadProgress}%</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- Reusable Components ---

const SectionTag = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 gpu-accel">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.4em]">{children}</span>
    </div>
)

const Heading = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <h2 className={`text-h2 font-black tracking-tighter text-white leading-[0.9] uppercase ${className} gpu-accel`}>
        {children}
    </h2>
)

// --- Main Cinematic Page ---

export default function LandingPage() {
    const router = useRouter()
    const { isLoggedIn } = useApp()
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const springProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 30,
        restDelta: 0.0001
    })

    // Choreography Transforms for Artifact
    // Responsive offset: reduce horizontal shift on mobile
    const xRange = typeof window !== 'undefined' && window.innerWidth < 768 ? ['0%', '10%', '-10%', '10%', '-10%', '0%', '0%'] : ['0%', '25%', '-25%', '25%', '-25%', '0%', '0%'];

    const xOffset = useTransform(
        scrollYProgress,
        [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
        xRange
    )

    const scaleRatio = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        [0.85, 0.7, 0.7, 0.75, 0.8, 1.4]
    )

    // Visibility Transforms
    const heroOp = useTransform(scrollYProgress, [0, 0.1], [1, 0])
    const aboutOp = useTransform(scrollYProgress, [0.1, 0.15, 0.25], [0, 1, 0])
    const statsOp = useTransform(scrollYProgress, [0.25, 0.3, 0.45], [0, 1, 0])
    const benefitsOp = useTransform(scrollYProgress, [0.45, 0.5, 0.6], [0, 1, 0])
    const categoriesOp = useTransform(scrollYProgress, [0.6, 0.65, 0.8], [0, 1, 0])
    const timelineOp = useTransform(scrollYProgress, [0.8, 0.85, 0.95], [0, 1, 0])
    const ctaOp = useTransform(scrollYProgress, [0.95, 1], [0, 1])

    const globalY = useTransform(scrollYProgress, [0, 1], [0, -100])

    return (
        <div ref={containerRef} className="root-container bg-[#050505] min-h-[700vh] text-white selection:bg-emerald-500/30 font-sans antialiased overflow-x-hidden">

            {/* FIXED CINEMATIC ELEMENT WRAPPER */}
            <div className="fixed inset-0 z-0 h-[100dvh] w-full pointer-events-none flex items-center justify-center overflow-hidden">
                <CinematicSequence progress={springProgress} xOffset={xOffset} scaleRatio={scaleRatio} />
            </div>

            {/* SCROLLABLE INTERFACE LAYERS */}
            <div className="relative z-10 w-full">

                {/* 1. HERO SECTION */}
                <section className="h-[100dvh] flex flex-col items-center justify-center text-center px-6">
                    <motion.div style={{ opacity: heroOp, y: globalY }} className="space-y-6 gpu-accel">
                        <SectionTag>The Celebration Returns</SectionTag>
                        <h1 className="text-hero font-bold tracking-tighter leading-[0.8] uppercase flex flex-col items-center">
                            <span>VANOTH</span>
                            <span className="text-emerald-500 italic">SAVA</span>
                        </h1>
                        <p className="text-[12px] uppercase tracking-[1em] text-emerald-500/50 pt-4">NMAMIT / 2026</p>
                    </motion.div>
                </section>

                {/* 2. ABOUT SECTION */}
                <section data-theme="light" className="h-[100dvh] flex items-center px-6 md:px-[10%] bg-white text-black relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
                    <motion.div style={{ opacity: aboutOp, y: globalY }} className="max-w-2xl space-y-8 relative z-10 gpu-accel">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-black/5 border border-black/10 rounded-full mb-6 text-black">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-[0.4em]">The Legacy</span>
                        </div>
                        <h2 className="text-h2 font-bold tracking-tighter text-black leading-[0.9] uppercase">
                            CELEBRATING <br /><span className="text-emerald-600 italic">CREATIVITY</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
                            Since 2006, Varnothsava has been the crucible for the brightest minds in the nation. It is where blueprints become
                            reality and stage fear becomes applause.
                        </p>
                    </motion.div>
                </section>


                {/* 3. STATS SECTION */}
                <section className="h-[100dvh] flex items-center justify-center md:justify-end px-6 md:px-[10%]">
                    <motion.div style={{ opacity: statsOp, y: globalY }} className="max-w-2xl space-y-12 text-center md:text-right gpu-accel">
                        <SectionTag>What to Expect</SectionTag>
                        <Heading>THE <span className="text-emerald-500 font-bold italic">FEST</span> BY THE NUMBERS</Heading>
                        <div className="grid grid-cols-2 gap-6 md:gap-10">
                            {[
                                { label: 'Prize Pool', value: '₹5L+' },
                                { label: 'Events', value: '50+' },
                                { label: 'Students', value: '10K+' },
                                { label: 'Colleges', value: '100+' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-4xl md:text-5xl font-bold text-white">{stat.value}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* 4. EXPERIENCE/BENEFITS */}
                <section className="h-[100dvh] flex items-center px-6 md:px-[10%]">
                    <motion.div style={{ opacity: benefitsOp, y: globalY }} className="max-w-2xl space-y-10 gpu-accel">
                        <SectionTag>Your Experience</SectionTag>
                        <Heading>BEYOND THE <br /><span className="text-emerald-500 italic">CLASSROOM</span></Heading>
                        <div className="space-y-6">
                            {[
                                { title: 'Hands-on Workshops', desc: 'Direct mentorship from industry giants in AI and Robotics.' },
                                { title: 'Cultural Extravaganza', desc: 'Nights filled with music, dance, and celebrity shows.' },
                                { title: 'Global Networking', desc: 'Meet peers and mentors from top universities.' }
                            ].map((benefit, i) => (
                                <div key={i} className="flex gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-white uppercase italic">{benefit.title}</h4>
                                        <p className="text-sm md:text-base text-slate-400">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* 5. CATEGORIES SECTION */}
                <section className="h-[100dvh] flex items-center justify-center md:justify-end px-6 md:px-[10%]">
                    <motion.div style={{ opacity: categoriesOp, y: globalY }} className="max-w-3xl space-y-12 text-center md:text-right gpu-accel">
                        <SectionTag>The Events</SectionTag>
                        <Heading>CHOOSE YOUR <br /><span className="text-emerald-500 italic">INTEREST</span></Heading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {[
                                { icon: Cpu, name: 'Technical', events: '25+ Events' },
                                { icon: Palette, name: 'Cultural', events: '20+ Events' },
                                { icon: Gamepad2, name: 'Gaming', events: '15+ Events' },
                                { icon: Music, name: 'Perform', events: '10+ Events' }
                            ].map((cat, i) => (
                                <div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/10 rounded-2xl text-center md:text-right hover:border-emerald-500/20 transition-colors">
                                    <cat.icon className="w-8 h-8 text-emerald-500 mb-4 mx-auto md:ml-auto md:mr-0" />
                                    <h4 className="text-xl md:text-2xl font-bold text-white italic">{cat.name}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{cat.events}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* 6. TIMELINE SECTION */}
                <section className="h-[100dvh] flex flex-col items-center justify-center text-center px-6">
                    <motion.div style={{ opacity: timelineOp, y: globalY }} className="space-y-12 gpu-accel">
                        <SectionTag>The Schedule</SectionTag>
                        <Heading>THE <span className="text-emerald-500">CHAPTERS</span></Heading>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl">
                            {['INCIPIT', 'ASCENDO', 'ZENITH'].map((day, i) => (
                                <div key={i} className="p-8 md:p-10 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2 italic">0{i + 1}</div>
                                    <div className="text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-widest italic">DAY 0{i + 1}</div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Main Fest Events</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* 7. FINAL CTA */}
                <section className="h-[100dvh] flex flex-col items-center justify-center text-center px-6">
                    <motion.div style={{ opacity: ctaOp }} className="space-y-12 pointer-events-auto gpu-accel">
                        <h3 className="text-display font-bold tracking-tighter leading-none text-white/90 uppercase">
                            START YOUR <br />
                            <span className="text-emerald-500 italic">JOURNEY.</span>
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center">
                            <motion.button
                                onClick={() => router.push(isLoggedIn ? '/profile' : '/login')}
                                whileHover={{ scale: 1.05, backgroundColor: '#10b981', color: '#000', boxShadow: '0 0 50px rgba(16,185,129,0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto px-10 md:px-16 py-6 md:py-8 bg-transparent border-2 border-emerald-500 text-emerald-500 font-bold text-xl md:text-2xl tracking-[0.2em] uppercase rounded-none transition-all hover-effect"
                            >
                                {isLoggedIn ? 'Go to Dashboard' : 'Join the Fest'}
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/events')}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto px-10 md:px-16 py-6 md:py-8 bg-transparent border-2 border-white/20 text-white font-bold text-xl md:text-2xl tracking-[0.2em] uppercase rounded-none hover-effect"
                            >
                                View All Events
                            </motion.button>
                        </div>
                    </motion.div>
                </section>

                {/* FOOTER */}
                <footer className="py-24 border-t border-white/5 bg-[#050505] text-center">
                    <div className="max-w-7xl mx-auto px-6 space-y-10">
                        <div className="text-5xl font-black text-white italic tracking-tighter uppercase">VARNOTHSAVA<span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">2026.</span></div>
                        <nav className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
                            <span className="hover:text-emerald-400 cursor-pointer">Instagram</span>
                            <span className="hover:text-emerald-400 cursor-pointer">Discord</span>
                            <span className="hover:text-emerald-400 cursor-pointer">Terminal</span>
                        </nav>
                        <p className="text-[10px] text-slate-800 uppercase tracking-[0.8em] pt-12">© 2K26 NMAMIT VISIONARIES / SYNCED</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}
