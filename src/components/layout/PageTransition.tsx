'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'

/**
 * PageTransition System
 * Optimized to ensure zero black-screen flashes when returning home.
 */
export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [isMobile, setIsMobile] = useState(false)
    const isLandingPage = pathname === '/'

    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
    }, [])

    // CRITICAL: When the target is the landing page, we completely bypass AnimatePresence.
    // This forces the old page to unmount INSTANTLY and the home page to mount INSTANTLY.
    // This eliminates the "wait" time where a black screen could flash.
    if (isLandingPage) {
        return (
            <div className="relative w-full bg-[#020202]">
                {children}
            </div>
        )
    }

    return (
        <div className="relative w-full overflow-hidden bg-[#020202]">
            {/* The Foundation Layer - ensures the viewport is never empty */}
            <div className="fixed inset-0 bg-[#020202] -z-[10000] pointer-events-none" />

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full"
                    style={{ willChange: 'opacity, transform' }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Cinematic Shutter - Only for sub-pages to maintain premium storytelling */}
            <motion.div
                key={`sweep-${pathname}`}
                initial={{ x: '100%' }}
                animate={{ x: '-200%' }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-0 z-[9999] pointer-events-none flex"
            >
                <div className="flex-1 bg-[#050805] border-r border-emerald-500/20" />
                <div className="flex-1 bg-[#0a120a] border-x border-emerald-500/10" />
                <div className="flex-1 bg-[#050805] border-l border-emerald-500/20" />
            </motion.div>
        </div>
    )
}
