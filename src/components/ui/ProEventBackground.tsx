'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

// --- HIGH-PERFORMANCE GRID ENGINE ---

function GridBeams() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = canvas.width = window.innerWidth
        let height = canvas.height = window.innerHeight

        // Grid Configuration
        const gridSize = 40
        const gridColor = 'rgba(16, 185, 129, 0.15)'
        const beamColor = 'rgba(16, 185, 129, 0.5)'
        const squareColor = 'rgba(16, 185, 129, 0.25)'

        // State
        const beams: { x: number, y: number, axis: 'x' | 'y', life: number, speed: number }[] = []
        const squares: { x: number, y: number, life: number }[] = []
        const particles: { x: number, y: number, s: number, vy: number, life: number }[] = []
        const mouse = { x: -1000, y: -1000 }

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }
        window.addEventListener('mousemove', handleMouseMove)

        // Initialize Particles (Digital Dust)
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                s: Math.random() * 2,
                vy: (Math.random() - 0.5) * 0.5,
                life: Math.random()
            })
        }

        // Animation Loop
        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // 0. Draw Nebula Pulse (Background Ambience)
            const time = Date.now() * 0.0005
            const pulseX = Math.sin(time) * 300 + width / 2
            const pulseY = Math.cos(time * 0.7) * 200 + height / 2

            const nebula = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 600)
            nebula.addColorStop(0, 'rgba(16, 185, 129, 0.05)')
            nebula.addColorStop(1, 'transparent')
            ctx.fillStyle = nebula
            ctx.fillRect(0, 0, width, height)

            // Mouse Glow
            const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300)
            mouseGlow.addColorStop(0, 'rgba(16, 185, 129, 0.08)')
            mouseGlow.addColorStop(1, 'transparent')
            ctx.fillStyle = mouseGlow
            ctx.fillRect(0, 0, width, height)


            // 1. Draw Static Grid
            ctx.strokeStyle = gridColor
            ctx.lineWidth = 1
            ctx.beginPath()

            for (let x = 0; x <= width; x += gridSize) {
                ctx.moveTo(x, 0); ctx.lineTo(x, height)
            }
            for (let y = 0; y <= height; y += gridSize) {
                ctx.moveTo(0, y); ctx.lineTo(width, y)
            }
            ctx.stroke()

            // 2. Manage & Draw Beams (Shooting Lines) - High Density
            if (Math.random() < 0.1) {
                const axis = Math.random() > 0.5 ? 'x' : 'y'
                beams.push({
                    x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
                    y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
                    axis,
                    life: 1.0,
                    speed: 4 + Math.random() * 6
                })
            }

            for (let i = beams.length - 1; i >= 0; i--) {
                const b = beams[i]
                b.life -= 0.02

                const grad = ctx.createLinearGradient(
                    b.x, b.y,
                    b.axis === 'x' ? b.x + 150 : b.x,
                    b.axis === 'y' ? b.y + 150 : b.y
                )
                grad.addColorStop(0, `rgba(16, 185, 129, 0)`)
                grad.addColorStop(1, beamColor)

                ctx.strokeStyle = grad
                ctx.lineWidth = 2
                ctx.beginPath()
                if (b.axis === 'x') { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + 150, b.y); b.x += b.speed }
                else { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + 150); b.y += b.speed }
                ctx.stroke()

                if (b.life <= 0 || b.x > width || b.y > height) beams.splice(i, 1)
            }

            // 3. Manage & Draw Active Squares (Flickering Cells) - Hyper Active
            if (Math.random() < 0.25) {
                squares.push({
                    x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
                    y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
                    life: 0
                })
            }

            // Mouse Interaction squares
            if (Math.random() < 0.5) {
                const mx = Math.floor(mouse.x / gridSize) * gridSize
                const my = Math.floor(mouse.y / gridSize) * gridSize
                squares.push({ x: mx, y: my, life: 0 })
            }

            for (let i = squares.length - 1; i >= 0; i--) {
                const s = squares[i]
                s.life += 0.04
                const alpha = Math.sin(s.life * Math.PI) * 0.35

                if (s.life >= 1) { squares.splice(i, 1); continue }

                ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`
                ctx.fillRect(s.x + 1, s.y + 1, gridSize - 2, gridSize - 2)
            }

            // 4. Draw Digital Particles
            ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                p.y -= p.vy
                if (p.y < 0) p.y = height
                if (p.y > height) p.y = 0

                // Mouse repulsion/attraction subtle
                const dx = p.x - mouse.x
                const dy = p.y - mouse.y
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < 100) {
                    p.x += dx * 0.01
                    p.y += dy * 0.01
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
                ctx.fill()
            }

            requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export default function ProEventBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020403]">
            {/* 1. Deep Space Base - With colorful undercurrents */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.05),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(6,78,59,0.1),transparent_70%)]" />

            {/* 2. The Animated Beam Grid - Fully Visible */}
            <div className="absolute inset-0 opacity-100 mix-blend-screen">
                <GridBeams />
            </div>

            {/* 3. Vignette - Reduced */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(2,4,3,0.7)_100%)] pointer-events-none" />

            {/* 4. Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>
    )
}
