'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Rocket, ArrowRight, Shield, Globe, Cpu, User, School, Search, Upload, CheckCircle2, ChevronDown, Camera, X, Fingerprint, Sparkles, Activity } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import ProEventBackground from '@/components/ui/ProEventBackground'

// --- COLLEGES DATA (CONSISTENT) ---
const COLLEGES = [
    "Nitte Mahalinga Adyanthaya Memorial Institute of Technology (NMAMIT), Nitte, Udupi",
    "Moodlakatte Institute of Technology, Kundapura",
    "Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Bantakal, Udupi",
    "Manipal Institute of Technology (MIT), Manipal",
    "Bearys Institute of Technology, Mangaluru",
    "Canara Engineering College, Bantwal",
    "Sahyadri College of Engineering & Management, Mangaluru",
    "Srinivas Institute of Technology, Mangaluru",
    "Yenepoya Institute of Technology, Moodabidri",
    "Vivekananda College of Engineering & Technology (VCET), Puttur",
    "B.M.S. College of Engineering, Bengaluru",
    "B.N.M. Institute of Technology, Bengaluru",
    "Bangalore Institute of Technology, Bengaluru",
    "Brindavan College of Engineering & Technology, Bengaluru",
    "City Engineering College, Bengaluru",
    "CMR Institute of Technology, Bengaluru",
    "Dayananda Sagar College of Engineering, Bengaluru",
    "Don Bosco Institute of Technology, Bengaluru",
    "Dr. Ambedkar Institute of Technology, Bengaluru",
    "H.K.B.K. College of Engineering, Bengaluru",
    "Indian Institute of Science (IISc), Bangalore",
    "International Institute of Information Technology, Bangalore (IIIT-B)",
    "New Horizon College of Engineering, Bengaluru",
    "PES University (Engineering), Bengaluru",
    "R.V. College of Engineering, Bengaluru",
    "Sapthagiri College of Engineering, Bengaluru",
    "SJB Institute of Technology, Bengaluru",
    "Sri Revana Siddeshwara Institute of Technology, Bengaluru",
    "Sri Venkateshwara College of Engineering, Bengaluru",
    "Vemana Institute of Technology, Bengaluru",
    "Other"
]

const GoogleIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
)

// --- REFINED PROFESSIONAL STUDENT PORTAL ---
function StudentPortalSphere() {
    const meshRef = useRef<THREE.Mesh>(null)
    const pointsRef = useRef<THREE.Points>(null)
    const { mouse } = useThree()

    useFrame((state) => {
        if (!meshRef.current || !pointsRef.current) return
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.y = t * 0.2
        pointsRef.current.rotation.y = -t * 0.15

        // Subtle mouse tracking
        meshRef.current.position.x += (mouse.x * 1.5 - meshRef.current.position.x) * 0.05
        meshRef.current.position.y += (mouse.y * 1.5 - meshRef.current.position.y) * 0.05
        pointsRef.current.position.copy(meshRef.current.position)
    })

    return (
        <group>
            <mesh ref={meshRef}>
                <sphereGeometry args={[2.2, 48, 48]} />
                <meshStandardMaterial
                    color="#10b981"
                    emissive="#059669"
                    emissiveIntensity={1.2}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>
            <points ref={pointsRef}>
                <sphereGeometry args={[3.8, 48, 48]} />
                <pointsMaterial
                    size={0.03}
                    color="#fbbf24"
                    transparent
                    opacity={0.5}
                    sizeAttenuation
                />
            </points>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
        </group>
    )
}

export default function LoginPage() {
    const { login, registerUser, isLoggedIn } = useApp()
    const router = useRouter()
    const [isRegister, setIsRegister] = useState(false)

    // Form States
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [usn, setUsn] = useState('')
    const [college, setCollege] = useState('')
    const [otherCollege, setOtherCollege] = useState('')

    // Dropdown helpers
    const [collegeSearch, setCollegeSearch] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const filteredColleges = COLLEGES.filter(c =>
        c.toLowerCase().includes(collegeSearch.toLowerCase())
    )

    const handleSubmitLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isRegister) {
            login(email, password)
            router.push('/events')
        }
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        const finalCollege = college === 'Other' ? otherCollege : college
        registerUser({
            name,
            email,
            password: password || 'student_pass',
            usn,
            collegeName: finalCollege,
            age: '19',
            phone: 'PENDING'
        })
        router.push('/events')
    }

    if (isLoggedIn) return null

    return (
        <main className="h-screen w-full bg-[#020805] text-white relative flex items-center justify-center overflow-hidden font-sans">
            {/* RICH BACKGROUND SYSTEM */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ProEventBackground theme="emerald" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-black" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container max-w-7xl h-full relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-12 py-8 lg:py-0 gap-8 lg:gap-0">

                {/* COMPACT LEFT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[45%] lg:pr-12"
                >
                    <div className="w-full h-[200px] lg:h-[350px] mb-4">
                        <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                            <StudentPortalSphere />
                        </Canvas>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            Varnothsava 2026 Portal
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-white italic">
                            THE STUDENT<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">EXPERIENCE.</span>
                        </h1>
                        <p className="max-w-sm mx-auto lg:mx-0 text-sm font-medium text-white/50 leading-relaxed">
                            Access your personalized dashboard, track registrations, and explore the future of college festivities in one seamless interface.
                        </p>
                    </div>
                </motion.div>

                {/* COMPACT PROFESSIONAL CARD WITH GLOWING HIGHLIGHT */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full lg:w-1/2 max-w-[480px] flex justify-center lg:justify-end relative"
                >
                    {/* OUTER PULSING GLOW */}
                    <div className="absolute -inset-1 bg-emerald-500/20 rounded-[2.6rem] blur-2xl animate-pulse" />

                    {/* ANIMATED TRACING BORDER */}
                    <div className="absolute -inset-[1px] rounded-[2.55rem] overflow-hidden p-[1px] opacity-70">
                        <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,#10b981_180deg,transparent_240deg,transparent_360deg)] animate-spin-slow" />
                    </div>

                    <div className="w-full relative bg-[#020b08]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl overflow-hidden">
                        {/* Subtle Content Shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-white/5 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {!isRegister ? (
                                <motion.div
                                    key="login-compact"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black text-white italic tracking-tighter">Sign In</h2>
                                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest italic">Personal Access Required</p>
                                    </div>

                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-black rounded-2xl hover:bg-emerald-50 transition-all font-bold text-xs uppercase tracking-wider shadow-lg transform active:scale-[0.98]">
                                            <GoogleIcon />
                                            Google Account
                                        </button>

                                        <div className="flex items-center gap-4 px-2">
                                            <div className="h-[1px] flex-1 bg-white/10" />
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">or credentials</span>
                                            <div className="h-[1px] flex-1 bg-white/10" />
                                        </div>

                                        <form onSubmit={handleSubmitLogin} className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="relative group/input">
                                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-emerald-400 transition-colors" />
                                                    <input
                                                        required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-3.5 text-sm font-medium focus:border-emerald-500/40 focus:bg-white/[0.07] outline-none transition-all text-white placeholder:text-white/10"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="relative group/input">
                                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-emerald-400 transition-colors" />
                                                    <input
                                                        required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-3.5 text-sm font-medium focus:border-emerald-500/40 focus:bg-white/[0.07] outline-none transition-all text-white placeholder:text-white/10"
                                                        placeholder="Password"
                                                    />
                                                </div>
                                            </div>

                                            <button className="w-full py-4 bg-emerald-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/40 transition-all active:scale-[0.98]">
                                                Sign In to Portal
                                            </button>
                                        </form>
                                    </div>

                                    <div className="text-center pt-2">
                                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
                                            New student? {' '}
                                            <button
                                                onClick={() => setIsRegister(true)}
                                                className="text-emerald-400 hover:underline underline-offset-4"
                                            >
                                                Create Profile
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register-compact"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black text-white italic tracking-tighter">Registration</h2>
                                            <p className="text-[10px] font-bold text-emerald-400/50 uppercase tracking-[0.2em]">New Student Profile</p>
                                        </div>
                                        <button onClick={() => setIsRegister(false)} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-4 max-h-[45vh] overflow-y-auto px-1 custom-scrollbar pr-2">
                                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium focus:border-emerald-500/40 outline-none text-white" placeholder="Full Name" />
                                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium focus:border-emerald-500/40 outline-none text-white" placeholder="Email (Student ID)" />
                                        <input required type="text" value={usn} onChange={(e) => setUsn(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium focus:border-emerald-500/40 outline-none text-white" placeholder="USN / Roll Number" />

                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium text-left text-white/40 flex justify-between items-center"
                                            >
                                                <span className="truncate">{college || 'Select College'}</span>
                                                <ChevronDown className={`w-4 h-4 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                                        className="absolute bottom-full left-0 right-0 mb-4 bg-[#0a1a12] border border-white/20 rounded-2xl p-2 z-[100] shadow-2xl"
                                                    >
                                                        <input
                                                            type="text" value={collegeSearch} onChange={(e) => setCollegeSearch(e.target.value)}
                                                            className="w-full bg-white/5 rounded-lg px-4 py-2 text-xs outline-none text-white mb-2" placeholder="Search..."
                                                        />
                                                        <div className="max-h-[120px] overflow-y-auto custom-scrollbar">
                                                            {filteredColleges.map(c => (
                                                                <button key={c} type="button" onClick={() => { setCollege(c); setIsDropdownOpen(false) }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 rounded-lg">
                                                                    {c}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <button className="w-full py-4 bg-emerald-500 text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-xl shadow-lg hover:bg-emerald-400 transition-all">
                                            Establish Identity
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 10px; }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </main>
    )
}
