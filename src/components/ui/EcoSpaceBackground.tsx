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

            {/* 2. Space Aspect: Subtle Starfield */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-20"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* 3. Environment Aspect: Large "Bio-Luminescent" Nebulas - Intensified for 'WOW' factor */}
            {/* Top Right Emerald Nebula */}
            <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_70%)] blur-[120px]" />

            {/* Bottom Left Deep Teal Nebula */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] blur-[140px]" />

            {/* Global Luminosity Core - Lifting the overall scene brightness */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none blur-[100px]" />

            {/* 4. "Bio-Particles" - Floating organic-tech fragments */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={`bio-${i}`}
                    className="absolute w-1 h-1 bg-emerald-400/30 rounded-full blur-[1px]"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0
                    }}
                    animate={{
                        y: ["-20%", "120%"],
                        x: ["-5%", "5%"],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 20,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                />
            ))}

            {/* 5. Structural Light Beams (Ethereal feel) */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,185,129,0.02)_0%,transparent_40%,rgba(16,185,129,0.02)_100%)]" />

            {/* 6. Subtle Grid (Technical anchor) */}
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(16,185,129,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.5)_1px,transparent_1px)] bg-[length:100px_100px]" />
        </div>
    )
}
