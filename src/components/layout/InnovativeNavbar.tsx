'use client'

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'framer-motion'
import { LayoutGrid, Zap, Trophy, Camera, User, ShoppingCart, Rocket, Menu, X, ArrowUpRight, Fingerprint } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
    { name: 'INDEX', href: '/', icon: LayoutGrid },
    { name: 'MISSIONS', href: '/events', icon: Zap },
    { name: 'GLORY', href: '/leaderboard', icon: Trophy },
    { name: 'ARCHIVE', href: '/gallery', icon: Camera },
]

export function InnovativeNavbar() {
    const pathname = usePathname()
    const { isLoggedIn, cart } = useApp()

    // UI STATES
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // BIOMETRIC STATES
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [scanComplete, setScanComplete] = useState(false)
    const [pressProgress, setPressProgress] = useState(0)
    const [showError, setShowError] = useState(false)
    const pressIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (pressIntervalRef.current) clearInterval(pressIntervalRef.current)
        }
    }, [])

    const handlePressStart = () => {
        if (isUnlocked || scanComplete) return
        if (pressIntervalRef.current) clearInterval(pressIntervalRef.current)

        setIsScanning(true)
        setShowError(false)
        setPressProgress(0)

        const startTime = Date.now()
        pressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min((elapsed / 3000) * 100, 100)
            setPressProgress(progress)

            if (elapsed >= 3000) {
                if (pressIntervalRef.current) clearInterval(pressIntervalRef.current)
                setScanComplete(true)
                setTimeout(() => setIsUnlocked(true), 800)
            }
        }, 16)
    }

    const handlePressEnd = () => {
        if (scanComplete) return

        if (pressProgress < 100) {
            if (pressIntervalRef.current) clearInterval(pressIntervalRef.current)
            setIsScanning(false)
            setPressProgress(0)
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
        }
    }

    const { scrollY } = useScroll()


    // Magnetic pull for the whole navbar
    const navX = useSpring(0, { stiffness: 100, damping: 30 })
    const navY = useSpring(0, { stiffness: 100, damping: 30 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window
            const x = (clientX - innerWidth / 2) / 50
            const y = (clientY - innerHeight / 2) / 50
            setMousePosition({ x, y })
            navX.set(x)
            navY.set(y)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Navbar intelligence: Scroll direction and magnitude

    useMotionValueEvent(scrollY, "change", (latest) => {
        const direction = latest > lastScrollY ? "down" : "up"
        const diff = Math.abs(latest - lastScrollY)

        if (latest < 50) {
            setIsVisible(true)
            setIsScrolled(false)
        } else {
            setIsScrolled(true)
            if (direction === "down" && latest > 100) {
                setIsVisible(false)
            } else if (direction === "up") {
                setIsVisible(true)
            }
        }
        setLastScrollY(latest)
    })

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const springConfig = { damping: 20, stiffness: 200 }



    return (
        <>
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        style={{ x: navX, y: navY }}
                        transition={{ type: 'spring', ...springConfig }}
                        className="fixed z-[1000] bottom-0 left-0 right-0 flex justify-center pb-8 px-4 pointer-events-none"
                    >
                        {/* HOLOGRAPHIC SHOCKWAVE EFFECT */}
                        <AnimatePresence>
                            {isUnlocked && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{ scale: 3, opacity: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute inset-x-0 bottom-10 mx-auto w-24 h-24 border-2 border-emerald-500 rounded-full blur-md pointer-events-none z-0"
                                />
                            )}
                        </AnimatePresence>

                        {!isUnlocked ? (
                            /* THE CYBER-BIOMETRIC TERMINAL */
                            <motion.div
                                layoutId="nav-container"
                                className="pointer-events-auto flex flex-col items-center gap-6"
                            >
                                <AnimatePresence>
                                    {showError && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute -top-16 bg-red-500/10 border border-red-500/50 backdrop-blur-xl px-4 py-2 rounded-xl"
                                        >
                                            <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest">
                                                ERROR: PLEASE_HOLD_TO_UNLOCK
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="relative flex items-center justify-center">
                                    {/* Rotating HUD Rings (Background) */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-[180px] h-[180px] border border-emerald-500/10 rounded-full border-dashed z-0"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-[140px] h-[140px] border-2 border-emerald-500/5 rounded-full border-dotted z-0"
                                    />

                                    {/* Progress Ring (Top Layer) */}
                                    <div className="absolute z-20 pointer-events-none">
                                        <svg className="w-[110px] h-[110px] -rotate-90">
                                            <circle
                                                cx="55"
                                                cy="55"
                                                r="52"
                                                fill="none"
                                                stroke="rgba(16, 185, 129, 0.1)"
                                                strokeWidth="3"
                                            />
                                            <motion.circle
                                                cx="55"
                                                cy="55"
                                                r="52"
                                                fill="none"
                                                stroke="rgba(16, 185, 129, 0.9)"
                                                strokeWidth="3"
                                                strokeDasharray="327"
                                                animate={{ strokeDashoffset: 327 - (327 * pressProgress) / 100 }}
                                                transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>

                                    {/* DATA SHARDS */}
                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.9, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="text-[8px] font-mono text-emerald-300 font-bold flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm"
                                        >
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                            STUDENT_PORTAL: SECURE_LINK
                                        </motion.div>
                                    </div>

                                    <motion.button
                                        onMouseDown={handlePressStart}
                                        onMouseUp={handlePressEnd}
                                        onMouseLeave={handlePressEnd}
                                        onTouchStart={handlePressStart}
                                        onTouchEnd={handlePressEnd}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={isScanning ? {
                                            x: [0, -1, 1, -1, 1, 0],
                                            y: [0, 1, -1, 1, -1, 0]
                                        } : {}}
                                        transition={isScanning ? {
                                            duration: 0.1,
                                            repeat: Infinity,
                                            ease: "linear"
                                        } : {}}
                                        className="relative w-24 h-24 rounded-full bg-emerald-950/40 backdrop-blur-2xl border border-emerald-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.15)] z-20 group"
                                    >
                                        <Fingerprint
                                            size={48}
                                            strokeWidth={1.2}
                                            className={cn(
                                                "transition-all duration-500 z-10",
                                                isScanning ? "text-emerald-300 scale-110 drop-shadow-[0_0_15px_rgba(110,231,183,1)]" : "text-emerald-500/60",
                                                scanComplete && "text-black scale-125"
                                            )}
                                        />
                                    </motion.button>

                                    {/* COORDINATE LABELS */}
                                    <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 text-[7px] font-mono text-emerald-400/50 bg-black/20 p-2 rounded-lg border border-emerald-500/10">
                                        <span className="flex justify-between gap-4"><span>PORTAL:</span> <span className="text-emerald-400">ACTIVE</span></span>
                                        <span className="flex justify-between gap-4"><span>YEAR:</span> <span className="text-emerald-400">2026</span></span>
                                        <span className="flex justify-between gap-4"><span>ID:</span> <span className="text-emerald-400">VERIFIED</span></span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="text-[11px] font-black tracking-[0.5em] text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                    >
                                        {scanComplete ? "WELCOME_STUDENT" : isScanning ? "OPENING_PORTAL..." : "HOLD_TO_ENTER"}
                                    </motion.span>
                                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                                </div>
                            </motion.div>
                        ) : (
                            /* THE CYBER-DOCK [OBSIDIAN NEON] */
                            <motion.div
                                layoutId="nav-container"
                                initial={{ width: 100, height: 100, borderRadius: 50, filter: "brightness(0)" }}
                                animate={{ width: "100%", height: 80, borderRadius: 0, filter: "brightness(1)" }}
                                className="relative w-full max-w-[700px] h-[80px] flex items-center pointer-events-auto group/nav"
                            >
                                <div className="absolute inset-0 -z-10 bg-[#050805]/80 backdrop-blur-[32px] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/[0.04] to-transparent skew-x-12"
                                    />

                                    <svg width="100%" height="80" viewBox="0 0 700 80" preserveAspectRatio="none" fill="none" className="absolute inset-0">
                                        <path d="M0 40C0 17.9086 17.9086 0 40 0H270C285 0 290 5 300 18C315 35 385 35 400 18C410 5 415 0 430 0H660C682.091 0 700 17.9086 700 40V80H0V40Z" fill="rgba(8, 12, 8, 0.6)" />
                                        <path d="M1 40C1 18.5 18.5 1 40 1H270C285 1 290 6 300 19C315 36 385 36 400 19C410 6 415 1 430 1H660C681 1 699 18.5 699 40" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.5" strokeLinecap="round" />
                                    </svg>
                                </div>

                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50">
                                    <Link href="/events">
                                        <Magnetic strength={0.4}>
                                            <div className="relative">
                                                {/* Ambient Energy Ripples */}
                                                <motion.div
                                                    animate={{ scale: [1, 2, 2.5], opacity: [0.5, 0.2, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                                                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.8, 2.2], opacity: [0.3, 0.1, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1 }}
                                                    className="absolute inset-0 bg-emerald-400/10 rounded-full blur-lg pointer-events-none"
                                                />

                                                <motion.div animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -inset-4 border border-emerald-500/20 rounded-full border-dashed" />
                                                <motion.div whileHover={{ scale: 1.15, filter: "hue-rotate(30deg)" }} className="w-[92px] h-[92px] bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-full border-[8px] border-[#0a120a] shadow-[0_20px_50px_rgba(16,185,129,0.5)] flex items-center justify-center group relative overflow-hidden">
                                                    <Zap size={36} className="text-black group-hover:scale-125 transition-transform" />
                                                </motion.div>
                                            </div>
                                        </Magnetic>
                                    </Link>
                                </div>

                                <div className="flex-1 flex justify-around items-center px-4">
                                    <Link href="/" className="group flex flex-col items-center gap-2 py-2">
                                        <div className={cn("relative p-3 rounded-2xl transition-all duration-500", pathname === '/' ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.6)]" : "text-white/80 group-hover:text-emerald-300 group-hover:bg-white/10")}>
                                            <LayoutGrid size={24} />
                                        </div>
                                        <span className={cn("text-[10px] font-mono tracking-[0.2em] font-black uppercase transition-all duration-300", pathname === '/' ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110" : "text-white/90 group-hover:text-emerald-300 group-hover:tracking-[0.3em]")}>HOME</span>
                                    </Link>
                                    <Link href="/leaderboard" className="group flex flex-col items-center gap-2 py-2">
                                        <div className={cn("relative p-3 rounded-2xl transition-all duration-500", pathname === '/leaderboard' ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.6)]" : "text-white/80 group-hover:text-emerald-300 group-hover:bg-white/10")}>
                                            <Trophy size={24} />
                                        </div>
                                        <span className={cn("text-[10px] font-mono tracking-[0.2em] font-black uppercase transition-all duration-300", pathname === '/leaderboard' ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110" : "text-white/90 group-hover:text-emerald-300 group-hover:tracking-[0.3em]")}>LEADERBOARD</span>
                                    </Link>
                                </div>

                                <div className="flex-1 flex justify-around items-center px-4">
                                    <Link href="/gallery" className="group flex flex-col items-center gap-2 py-2">
                                        <div className={cn("relative p-3 rounded-2xl transition-all duration-500", pathname === '/gallery' ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.6)]" : "text-white/80 group-hover:text-emerald-300 group-hover:bg-white/10")}>
                                            <Camera size={24} />
                                        </div>
                                        <span className={cn("text-[10px] font-mono tracking-[0.2em] font-black uppercase transition-all duration-300", pathname === '/gallery' ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110" : "text-white/90 group-hover:text-emerald-300 group-hover:tracking-[0.3em]")}>GALLERY</span>
                                    </Link>
                                    <Link href={isLoggedIn ? "/profile" : "/login"} className="group flex flex-col items-center gap-2 py-2">
                                        <div className={cn("relative p-3 rounded-2xl transition-all duration-500", pathname === '/profile' ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.6)]" : "text-white/80 group-hover:text-emerald-300 group-hover:bg-white/10")}>
                                            <User size={24} />
                                        </div>
                                        <span className={cn("text-[10px] font-mono tracking-[0.2em] font-black uppercase transition-all duration-300", pathname === '/profile' ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110" : "text-white/90 group-hover:text-emerald-300 group-hover:tracking-[0.3em]")}>{isLoggedIn ? 'PROFILE' : 'LOGIN'}</span>
                                    </Link>
                                </div>

                                <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-emerald-400/40 rounded-tl-[2.5rem] shadow-[-5px_-5px_15px_rgba(52,211,153,0.1)]" />
                                <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-emerald-400/40 rounded-tr-[2.5rem] shadow-[5px_-5px_15px_rgba(52,211,153,0.1)] flex items-start justify-end p-2 px-4 overflow-hidden">
                                    {/* Live System Monitoring (Student Waveform) */}
                                    <div className="flex items-end gap-[1px] h-3 opacity-40">
                                        {[1, 2, 3, 4, 3, 2, 1, 2, 3].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [`${h * 20}%`, `${(h + 2) * 20}%`, `${h * 20}%`] }}
                                                transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                                                className="w-[1px] bg-emerald-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[5px] font-mono text-emerald-400/40 ml-1 mt-[2px] tracking-tighter">PORTAL_STABILITY: 99.9%</span>
                                </div>

                                <div className="absolute right-[-100px] bottom-0 flex flex-col items-center gap-4 pointer-events-auto">
                                    <Link href="/checkout" className="block relative group">
                                        <motion.div whileHover={{ scale: 1.1, x: 10 }} className="p-5 bg-black/60 backdrop-blur-3xl border border-emerald-500/30 rounded-[1.5rem] shadow-2xl overflow-hidden">
                                            <ShoppingCart size={22} className="text-emerald-400" />
                                            {cart.length > 0 && (
                                                <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#050805]">
                                                    {cart.length}
                                                </span>
                                            )}
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 lg:hidden"
                    >
                        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                            <X size={24} />
                        </button>
                        <div className="flex flex-col gap-8 text-center">
                            {NAV_LINKS.map((link, i) => (
                                <motion.div key={link.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter hover:text-emerald-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
