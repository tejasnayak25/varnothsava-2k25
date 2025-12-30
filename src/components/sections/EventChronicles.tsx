'use client'

import { motion } from 'framer-motion'
import { Activity, Clock, Target, Shield, Zap } from 'lucide-react'
import { CosmicBackground } from '@/components/ui/CosmicBackground'

const events = [
    {
        date: 'MAR 24',
        event: 'PROJECT_GREEN_LAUNCH',
        desc: 'Official sector opening. Deploying bio-integrated server infrastructure and planetary sync protocols.',
        status: 'COMPLETED'
    },
    {
        date: 'MAR 26',
        event: 'VERDANT_SUMMIT_2K26',
        desc: 'Collaborative drafting of the Green Charter. Architectural focus on sustainable orbital outposts.',
        status: 'READY'
    },
    {
        date: 'MAR 27',
        event: 'ECO_ROVER_TRIALS',
        desc: 'Autonomous surface exploration trials across the planetary proving grounds for resource efficiency.',
        status: 'UPCOMING'
    }
]

export function EventChronicles() {
    return (
        <section className="relative py-24 px-6 bg-[#050805] overflow-hidden">
            <CosmicBackground />
            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="mb-20 space-y-4 border-l-2 border-emerald-500 pl-8">
                    <div className="flex items-center gap-3 text-emerald-400 font-mono text-[9px] uppercase tracking-[0.4em] font-black">
                        PLANETARY_LOG_SYNC
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        MISSION<br /><span className="text-emerald-500/30 not-italic">LOGS.EXE_</span>
                    </h2>
                </div>

                <div className="grid gap-8">
                    {events.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="glass-card p-10 group"
                        >
                            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                                <div className="space-y-2 md:w-48">
                                    <div className="text-[8px] text-emerald-400 font-black tracking-widest uppercase">TIMESTAMP</div>
                                    <div className="text-4xl font-black text-white italic tracking-tighter italic">{log.date}</div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{log.event}</h3>
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-white/40 rounded-full uppercase">{log.status}</div>
                                    </div>
                                    <p className="text-sm text-white/40 leading-relaxed font-medium italic">
                                        "{log.desc}"
                                    </p>
                                </div>
                                <div className="hidden lg:block opacity-10 group-hover:opacity-100 group-hover:text-emerald-500 transition-all">
                                    <Shield className="w-10 h-10" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
