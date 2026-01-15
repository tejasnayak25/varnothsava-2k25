'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment, Stars, useGLTF } from '@react-three/drei'
import { useRef, Suspense, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { ChevronDown, Users, Activity, Globe } from 'lucide-react'
import Link from 'next/link'

function AncientRuins({ isMobile }: { isMobile: boolean }) {
    const { scene } = useGLTF('/models/ancient_ruins.glb')
    const modelRef = useRef<THREE.Group>(null!)

    // Clone the scene to ensure we have a fresh copy without previous modifications
    const copiedScene = useMemo(() => scene.clone(), [scene])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (modelRef.current) {
            // Lowered for better alignment - Facing straight front now
            modelRef.current.position.y = -1.5 + Math.sin(t * 0.3) * 0.2
            modelRef.current.rotation.y = Math.sin(t * 0.05) * 0.02 // Very subtle front-facing sway
        }
    })

    useEffect(() => {
        copiedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                mesh.castShadow = true
                mesh.receiveShadow = true

                if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial
                    if (mat.emissive) {
                        mat.emissive.setHex(0x000000)
                    }
                    mat.roughness = 0.7
                    mat.metalness = 0.2
                }
            }
        })
    }, [copiedScene])

    return (
        <primitive
            ref={modelRef}
            object={copiedScene}
            scale={isMobile ? 5 : 8}
            position={[isMobile ? 0 : 4, -1.5, -2]}
            rotation={[0, 0, 0]}
        />
    )
}

function MovingLight() {
    const light = useRef<THREE.PointLight>(null!)
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        light.current.position.x = Math.sin(t * 0.5) * 15
        light.current.position.y = Math.cos(t * 0.3) * 10
        light.current.position.z = 10 + Math.sin(t * 0.4) * 5
    })
    return <pointLight ref={light} intensity={25} color="#10b981" />
}

function SpaceScene({ isMobile }: { isMobile: boolean }) {
    return (
        <group>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <AncientRuins isMobile={isMobile} />
            </Float>
        </group>
    )
}

export function Hero3D() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <div className="relative h-screen min-h-[800px] w-full bg-[#050906] overflow-hidden pt-20">
            {/* Professional 3D Sector */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full z-0"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
                <Canvas
                    camera={{ position: [0, 0, 15], fov: 35 }}
                    gl={{
                        antialias: true,
                        powerPreference: 'high-performance',
                        alpha: true,
                    }}
                    shadows
                    dpr={[1, 2]}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
                        <pointLight position={[-10, 5, 10]} intensity={1.5} color="#ffffff" />

                        <MovingLight />

                        <Environment preset="night" />
                        <Stars radius={100} depth={50} count={isMobile ? 200 : 1500} factor={4} saturation={0} fade speed={0.5} />
                        <SpaceScene isMobile={isMobile} />
                    </Suspense>
                    {/* Only orbit controls for desktop to allow interaction */}
                    {!isMobile && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />}
                </Canvas>
            </motion.div>

            {/* Clean Hero Content - Green Accents */}
            <div className="relative z-10 container mx-auto px-6 lg:px-20 flex flex-col justify-center h-[calc(100vh-80px)]">
                <div className="max-w-5xl space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent" />
                            <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.8em] font-black italic">
                                ACADEMIC_SYNERGY_2K26
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-none text-white uppercase italic">
                            <span className="inline-block hover:scale-[1.02] transition-transform duration-500">VARNOTH</span>
                            <span className="text-emerald-500 not-italic bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 ml-4">SAVA.2K26</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/40 font-medium max-w-2xl leading-relaxed">
                            Architecting the intersection of <span className="text-white">Cultural Heritage</span> and <span className="text-emerald-400">Future-Tech Innovations</span>.
                        </p>

                        <div className="flex flex-wrap gap-8 pt-6">
                            <Link href='/register' className="group relative px-12 py-5 overflow-hidden" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                                <div className="absolute inset-0 bg-emerald-600 transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent" />
                                <span className="relative z-10 text-white font-black uppercase text-xs tracking-widest">REGISTER_NOW</span>
                            </Link>
                            <Link href='/events' className="group relative px-12 py-5 border border-white/20 overflow-hidden hover:border-emerald-500/50 transition-colors" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10 text-white font-black uppercase text-xs tracking-widest">EXPLORE_EVENTS</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Minimal Metrics - Green Theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-8 pt-12 border-t border-white/10 max-w-2xl"
                    >
                        {[
                            { label: 'PARTICIPANTS', value: '2500+', icon: Users },
                            { label: 'COLLEGES', value: '50+', icon: Globe },
                            { label: 'STATUS', value: 'REG_OPEN', icon: Activity }
                        ].map((stat, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="flex items-center gap-3 text-emerald-400/60 group-hover:text-emerald-400 transition-colors">
                                    <stat.icon className="w-4 h-4" />
                                    <span className="text-[9px] uppercase tracking-[0.3em] font-black leading-none">{stat.label}</span>
                                </div>
                                <div className="text-4xl font-black text-white italic tracking-tighter mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Link */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
            >
                <div className="text-[8px] uppercase font-bold tracking-[0.5em] text-emerald-400">DESCEND</div>
                <ChevronDown className="w-5 h-5 text-emerald-400" />
            </motion.div>
        </div >
    )
}
