'use client'

import { motion } from 'framer-motion'
import { QrCode, CreditCard, ShieldCheck, Zap, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import Link from 'next/link'

export function CheckoutSystem() {
    const { cart, removeFromCart, totalAmount, login } = useApp()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const handlePayment = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setIsDone(true)
            login() // Auto login for dummy flow
        }, 3000)
    }

    if (cart.length === 0 && !isDone) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-6">Your Pass is Empty</h2>
                <p className="text-zinc-500 mb-12 max-w-sm italic">No dimensions have been synchronized yet. Head back to the Events Grid.</p>
                <Link href="/events" className="px-12 py-5 bg-purple-600 sci-fi-card font-bold uppercase tracking-widest text-xs">
                    Browse Events
                </Link>
            </div>
        )
    }

    if (isDone) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-12 animate-bounce border border-emerald-500/30">
                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-6 text-glow-cyan text-cyan-400">PAYMENT SECURED</h2>
                <p className="text-zinc-500 mb-12 max-w-sm italic">Your cosmic pass has been generated. Synchronization with SMVITM Hyper-Core complete.</p>
                <Link href="/dashboard" className="px-12 py-5 bg-purple-600 sci-fi-card font-bold uppercase tracking-widest text-xs flex items-center gap-4">
                    Access My Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        )
    }

    return (
        <div className="py-32 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Cart List */}
                <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase">EVENT <span className="text-purple-600">MANIFEST</span></h2>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Synchronization Status: In-Progress</p>
                    </div>

                    <div className="space-y-6">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-8 p-6 bg-white/[0.02] border border-white/5 sci-fi-card group"
                            >
                                <div className="w-24 h-24 shrink-0 overflow-hidden sci-fi-card">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[8px] font-mono text-purple-500 tracking-widest uppercase mb-1 block">{item.type}</span>
                                    <h4 className="text-2xl font-black italic tracking-tighter uppercase">{item.title}</h4>
                                    <p className="text-cyan-400 font-mono font-bold mt-2">₹{item.price}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all group-hover:scale-110"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="lg:col-span-5">
                    <div className="sci-fi-card bg-purple-600/5 p-10 space-y-10 border-purple-500/20 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />

                        <div className="space-y-6 relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase border-b border-white/10 pb-6">Synchronization Totals</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-zinc-500">
                                    <span className="uppercase tracking-widest font-bold">Subtotal ({cart.length} events)</span>
                                    <span className="font-mono">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-sm text-zinc-500">
                                    <span className="uppercase tracking-widest font-bold">Hyper-Core Fees</span>
                                    <span className="font-mono">₹0.00</span>
                                </div>
                                <div className="w-full h-px bg-white/5 my-6" />
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-black italic uppercase tracking-tighter">TOTAL AMOUNT</span>
                                    <span className="text-4xl font-black text-glow-purple text-purple-400 font-mono">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full py-6 bg-purple-600 hover:bg-purple-500 transition-all font-black uppercase tracking-[0.2em] italic sci-fi-card flex items-center justify-center gap-4 relative overflow-hidden group"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>PROCESSING PAYLOAD...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-6 h-6 fill-white" />
                                        <span>SECURE COSMIC PASS</span>
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-4 text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Protocol v2.6 // AES_ENCRYPTED
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
