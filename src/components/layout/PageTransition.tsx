'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
    }, [])

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
            className="relative z-10 w-full"
        >
            {children}
        </motion.div>
    )
}
