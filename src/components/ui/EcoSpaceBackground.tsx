'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function EcoSpaceBackground() {
    // Generate random stars for the "Space" aspect
    const stars = useMemo(() => {
        return [...Array(100)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5
        }))
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 1. Base Gradient - Lighter than pure black, shifting towards Emerald Space */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#041208] via-[#020602] to-[#010a05]" />

            {/* 2. Space Aspect: Subtle Starfield - CSS Optimized */}
            <div className="absolute inset-0 translate-z-0">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full opacity-20 animate-twinkle"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            animationDuration: `${star.duration}s`,
                            animationDelay: `${star.delay}s`,
                            willChange: 'transform, opacity'
                        }}
                    />
                ))}
            </div>

            {/* 3. Environment Aspect: Large "Bio-Luminescent" Nebulas - GPU Accelerated */}
            {/* Top Right Emerald Nebula */}
            <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_70%)] blur-[120px] will-change-transform" style={{ transform: 'translate3d(0,0,0)' }} />

            {/* Bottom Left Deep Teal Nebula */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] blur-[140px] will-change-transform" style={{ transform: 'translate3d(0,0,0)' }} />

            {/* Global Luminosity Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none blur-[100px] will-change-transform" style={{ transform: 'translate3d(-50%,-50%,0)' }} />

            {/* 4. "Bio-Particles" - CSS Optimized */}
            {[...Array(15)].map((_, i) => (
                <div
                    key={`bio-${i}`}
                    className="absolute w-1 h-1 bg-emerald-400/30 rounded-full blur-[1px] animate-float-up"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '120%',
                        animationDuration: `${Math.random() * 20 + 20}s`,
                        animationDelay: `${i * 2}s`,
                        willChange: 'transform, opacity'
                    }}
                />
            ))}

            {/* 5. Structural Light Beams (Ethereal feel) */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,185,129,0.02)_0%,transparent_40%,rgba(16,185,129,0.02)_100%)]" />

            {/* 6. Subtle Grid (Technical anchor) */}
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(16,185,129,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.5)_1px,transparent_1px)] bg-[length:100px_100px]" />

            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.2); }
                }
                @keyframes float-up {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-140vh) translateX(20px); opacity: 0; }
                }
                .animate-twinkle {
                    animation: twinkle infinite ease-in-out;
                }
                .animate-float-up {
                    animation: float-up infinite linear;
                }
            `}</style>
        </div>
    )
}
