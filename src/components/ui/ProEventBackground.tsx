'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProEventBackgroundProps {
    theme?: 'emerald' | 'amber' | 'cyan' | 'indigo' | 'gaming'
    scrollProgress?: number
    isDetailed?: boolean
}

// --- GAMING RADAR EFFECT (FOR GAMING THEME) ---
const GamingPulse = React.memo(() => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0)_50%,rgba(220,38,38,0.1)_50%)] bg-[length:100%_4px] opacity-20" />

            {/* Pulsing Radar Rings */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-600/20"
                    initial={{ width: '0%', height: '0%', opacity: 0.5 }}
                    animate={{ width: '150%', height: '150%', opacity: 0 }}
                    transition={{ duration: 4, delay: i * 1.5, repeat: Infinity, ease: "easeOut" }}
                />
            ))}

            {/* Glitch Particles */}
            <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-[1px] bg-red-500/30"
                        style={{
                            left: 0,
                            right: 0,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            x: [-20, 20, -20]
                        }}
                        transition={{
                            duration: 0.2,
                            delay: Math.random() * 5,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 5
                        }}
                    />
                ))}
            </div>
        </div>
    )
})

// --- HIGH-PERFORMANCE GRID ENGINE ---
const GridBeams = React.memo(({ theme = 'emerald' }: { theme?: 'emerald' | 'amber' | 'cyan' | 'indigo' | 'gaming' }) => {
    // ... existing useEffect with added gaming logic ...
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isMobile, setIsMobile] = React.useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) return

        const scaleFactor = isMobile ? 0.5 : 1
        let width = canvas.width = window.innerWidth * scaleFactor
        let height = canvas.height = window.innerHeight * scaleFactor
        canvas.style.width = '100%'
        canvas.style.height = '100%'

        const getRGB = () => {
            if (theme === 'gaming') return '220, 38, 38' // Red-600
            if (theme === 'amber') return '251, 191, 36'
            if (theme === 'cyan') return '6, 182, 212'
            if (theme === 'indigo') return '99, 102, 241'
            return '16, 185, 129'
        }
        const rgb = getRGB()
        const isEmerald = theme === 'emerald'
        const isGaming = theme === 'gaming'

        const gridSize = isMobile ? 80 : (isGaming ? 40 : 50)
        const gridColor = `rgba(${rgb}, ${isEmerald ? 0.15 : (isGaming ? 0.12 : 0.08)})`
        // ... existing render logic simplified for brevity but needs to be complete ...
        const beams: { x: number; y: number; axis: 'x' | 'y'; life: number; speed: number }[] = []
        const squares: { x: number; y: number; life: number }[] = []
        const particles: { x: number; y: number; s: number; vy: number }[] = []

        const particleCount = isMobile ? 15 : 40
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                s: Math.random() * (isMobile ? 1.2 : 2),
                vy: (Math.random() - 0.5) * 0.4
            })
        }

        let rafId: number
        const render = () => {
            ctx.clearRect(0, 0, width, height)
            ctx.strokeStyle = gridColor
            ctx.lineWidth = 1
            ctx.beginPath()
            for (let x = 0; x <= width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, height) }
            for (let y = 0; y <= height; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(width, y) }
            ctx.stroke()

            if (Math.random() < (isMobile ? 0.02 : 0.06)) {
                const axis = Math.random() > 0.5 ? 'x' : 'y'
                beams.push({
                    x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
                    y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
                    axis, life: 1.0, speed: 2 + Math.random() * 4
                })
            }

            for (let i = beams.length - 1; i >= 0; i--) {
                const b = beams[i]; b.life -= 0.015
                if (b.life <= 0) { beams.splice(i, 1); continue }
                const grad = ctx.createLinearGradient(b.x, b.y, b.axis === 'x' ? b.x + 100 : b.x, b.axis === 'y' ? b.y + 100 : b.y)
                grad.addColorStop(0, 'transparent'); grad.addColorStop(1, `rgba(${rgb}, ${b.life * 0.6})`)
                ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.beginPath()
                if (b.axis === 'x') { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + 100, b.y); b.x += b.speed }
                else { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + 100); b.y += b.speed }
                ctx.stroke()
            }

            if (Math.random() < 0.05) squares.push({ x: Math.floor(Math.random() * (width / gridSize)) * gridSize, y: Math.floor(Math.random() * (height / gridSize)) * gridSize, life: 0 })
            for (let i = squares.length - 1; i >= 0; i--) {
                const s = squares[i]; s.life += 0.02
                if (s.life >= 1) { squares.splice(i, 1); continue }
                ctx.fillStyle = `rgba(${rgb}, ${Math.sin(s.life * Math.PI) * 0.15})`; ctx.fillRect(s.x + 1, s.y + 1, gridSize - 2, gridSize - 2)
            }

            ctx.fillStyle = `rgba(${rgb}, 0.3)`
            for (let p of particles) {
                p.y -= p.vy; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill()
            }
            rafId = requestAnimationFrame(render)
        }
        render()
        return () => cancelAnimationFrame(rafId)
    }, [isMobile, theme])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
})

// --- FLOATING ENERGY ORBS ---
const FloatingOrbs = React.memo(({ theme = 'emerald' }: { theme?: 'emerald' | 'amber' | 'cyan' | 'indigo' | 'gaming' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isMobile, setIsMobile] = React.useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: true })
        if (!ctx) return
        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight
        const getRGB = () => {
            if (theme === 'gaming') return '239, 68, 68' // Red-500
            if (theme === 'amber') return '251, 191, 36'
            if (theme === 'cyan') return '6, 182, 212'
            if (theme === 'indigo') return '99, 102, 241'
            return '16, 185, 129'
        }
        const rgb = getRGB()
        const orbs: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = []
        const count = isMobile ? 5 : 12
        for (let i = 0; i < count; i++) {
            orbs.push({
                x: Math.random() * width, y: Math.random() * height,
                r: Math.random() * (isMobile ? 100 : 250) + 50,
                vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.08 + 0.03
            })
        }
        let rafId: number; let lastTime = 0; const interval = 1000 / 30
        const render = (time: number) => {
            if (time - lastTime < interval) { rafId = requestAnimationFrame(render); return }
            lastTime = time; ctx.clearRect(0, 0, width, height)
            for (const orb of orbs) {
                orb.x += orb.vx; orb.y += orb.vy; if (orb.x < -orb.r) orb.x = width + orb.r; if (orb.x > width + orb.r) orb.x = -orb.r; if (orb.y < -orb.r) orb.y = height + orb.r; if (orb.y > height + orb.r) orb.y = -orb.r
                const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r)
                grad.addColorStop(0, `rgba(${rgb}, ${orb.alpha})`); grad.addColorStop(1, 'transparent')
                ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2); ctx.fill()
            }
            rafId = requestAnimationFrame(render)
        }
        rafId = requestAnimationFrame(render); return () => cancelAnimationFrame(rafId)
    }, [theme, isMobile])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />
})

export default function ProEventBackground({ theme = 'emerald', scrollProgress = 0, isDetailed = false }: ProEventBackgroundProps) {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <AnimatePresence mode="popLayout">
            {theme === 'gaming' && (
                <motion.div
                    key="gaming-layer"
                    className="fixed inset-0 z-0 pointer-events-none bg-[#0d0202] will-change-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.18),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.1),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_70%)]" />

                    <div className="absolute inset-0 opacity-100 mix-blend-screen">
                        <GridBeams theme="gaming" />
                    </div>

                    <GamingPulse />
                    <FloatingOrbs theme="gaming" />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(13,2,2,0.4)_100%)] pointer-events-none" />
                </motion.div>
            )}

            {theme === 'amber' && (
                <motion.div
                    key="amber-layer"
                    className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f0901] will-change-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_80%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(245,158,11,0.1),transparent_60%)]" />

                    {!isDetailed && (
                        <div className="absolute inset-0 z-0 flex items-start justify-center overflow-hidden">
                            <img src="/cultural-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-110" />
                            <motion.img
                                src="/cultural-bg.png" alt="Cultural Background"
                                className="relative z-10 w-full md:h-auto h-full object-cover md:object-contain opacity-100"
                                loading="eager"
                                style={{
                                    filter: isMobile ? 'brightness(0.8) contrast(1.1)' : 'brightness(1.1) contrast(1.05)',
                                    transformOrigin: 'top',
                                    y: scrollProgress * 0.1
                                }}
                            />
                            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/10 via-transparent to-[#0f0901]/90" />
                        </div>
                    )}

                    <FloatingOrbs theme="amber" />
                </motion.div>
            )}

            {theme === 'emerald' && (
                <motion.div
                    key="emerald-layer"
                    className="fixed inset-0 z-0 pointer-events-none bg-[#010a06] will-change-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.18),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(16,185,129,0.08),transparent_50%)]" />
                    <div className="absolute inset-0 opacity-100 mix-blend-screen">
                        <GridBeams theme={theme} />
                    </div>
                    <FloatingOrbs theme="emerald" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(1,10,6,0.5)_100%)] pointer-events-none" />
                </motion.div>
            )}

            {theme === 'cyan' && (
                <motion.div
                    key="cyan-layer"
                    className="fixed inset-0 z-0 pointer-events-none bg-[#00080d] will-change-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.18),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(6,182,212,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 opacity-100 mix-blend-screen">
                        <GridBeams theme="cyan" />
                    </div>
                    <FloatingOrbs theme="cyan" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,8,13,0.5)_100%)] pointer-events-none" />
                </motion.div>
            )}

            {theme === 'indigo' && (
                <motion.div
                    key="indigo-layer"
                    className="fixed inset-0 z-0 pointer-events-none bg-[#03030f] will-change-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.18),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 opacity-100 mix-blend-screen">
                        <GridBeams theme="indigo" />
                    </div>
                    <FloatingOrbs theme="indigo" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(3,3,15,0.6)_100%)] pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

