'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Zap, X } from 'lucide-react';

// --- PREMIUM IMAGE DATA ---
const IMAGE_FILES = [
    "DSC_0046.JPG",
    "DSC_0035.JPG",
    "DSC_0318.JPG",
    "DSC_0339.JPG",
    "DSC_0762.JPG",
    "DSC_0489.JPG",
    "DSC_0832.JPG",
    "DSC_0864.JPG",
    "DSC_0841.JPG",
    "IMG_1238.JPG",
    "DSC_0012.JPG",
    "DSC_0018.JPG",
    "DSC_0030.JPG",
    "DSC_0033.JPG",
    "DSC_0007.JPG"
];

const PRODUCTS = IMAGE_FILES.map((file, i) => ({
    id: i,
    src: `/img/${file}`,
    title: file.split('.')[0].replace(/_/g, ' ').toUpperCase(),
    tag: ["CULTURAL", "TECHNICAL", "GAMING", "MEMORIES"][i % 4],
    description: "Varnothsava 2026 — A cinematic archive of innovation, culture, and unforgettable moments.",
}));

export function CosmicJoystickGallery() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const outerRingRef = useRef<HTMLDivElement>(null);
    const innerPadRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const menuLabelRef = useRef<HTMLDivElement>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const topHudRef = useRef<HTMLDivElement>(null);
    const navArrowsRef = useRef<HTMLDivElement>(null);

    // --- INFINITE SLIDER ENGINE ---
    const updateGallery = useCallback((durationOverride: number = 0.8, easeOverride: string = "expo.out") => {
        if (!sliderRef.current) return;
        const total = PRODUCTS.length;
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

        itemsRef.current.forEach((item, idx) => {
            if (!item) return;

            // Calculate circular distance
            let diff = idx - currentIndex;
            const half = total / 2;
            if (diff > half) diff -= total;
            if (diff < -half) diff += total;

            const active = idx === currentIndex;

            // --- RESPONSIVE 3D CONFIG ---
            const spacingDeg = isMobile ? 55 : 35;
            const angle = diff * spacingDeg;
            const rad = angle * (Math.PI / 180);
            const radius = isMobile ? 420 : 1100;

            const x = Math.sin(rad) * radius;
            const z = (Math.cos(rad) * radius) - radius;
            const rotateY = angle;
            const opacity = Math.abs(angle) > (isMobile ? 85 : 100) ? 0 : 1;

            // Refined scaling: Base size is 440px. Scale down significantly for mobile.
            const scale = active ? (isMobile ? 0.60 : 1.05) : (isMobile ? 0.40 : 0.8);
            const yOffset = isMobile ? -60 : 0;

            gsap.to(item, {
                x: x,
                y: yOffset,
                z: z,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
                zIndex: 1000 + Math.round(z),
                transformOrigin: "50% 50%",
                duration: durationOverride,
                ease: easeOverride,
                overwrite: 'auto',
                force3D: true
            });
        });
    }, [currentIndex]);

    // Handle Resize for Responsiveness
    useEffect(() => {
        const handleResize = () => {
            updateGallery(0.5, "power2.out");
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateGallery]);

    const isFirstRender = useRef(true);
    const isAutoMoving = useRef(false);

    // Initialize gallery
    React.useLayoutEffect(() => {
        if (isFirstRender.current) {
            updateGallery(0);
            isFirstRender.current = false;
        }
    }, [updateGallery]);

    // Update on index change
    useEffect(() => {
        if (!isFirstRender.current) {
            const duration = isAutoMoving.current ? 3.0 : 0.75;
            const ease = isAutoMoving.current ? "none" : "expo.out";
            updateGallery(duration, ease);
        }
    }, [currentIndex, updateGallery]);

    // --- NAVIGATION ---
    const move = (dir: number) => {
        if (isPreviewOpen) return;
        if (isAnimating) return;

        setIsAnimating(true);
        setCurrentIndex(prev => (prev + dir + PRODUCTS.length) % PRODUCTS.length);

        setTimeout(() => setIsAnimating(false), 300);
    };

    // --- JOYSTICK LOGIC ---
    const dragRef = useRef({
        active: false,
        startX: 0,
        hasTriggered: false
    });

    // --- JOYSTICK LOGIC (CONTINUOUS) ---
    const startContinuousMove = (dir: number) => {
        if (intervalRef.current) return; // Already running
        move(dir); // Immediate Trigger
        intervalRef.current = setInterval(() => {
            move(dir);
        }, 200); // Repeat every 200ms
    };

    const stopContinuousMove = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isPreviewOpen) {
            togglePreview(); // Close immediately on click
            return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = {
            active: true,
            startX: e.clientX,
            hasTriggered: false
        };
        // Visual feedback
        setIsDragging(true);
        gsap.to(innerPadRef.current, { scale: 0.9, duration: 0.2 });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragRef.current.active || isPreviewOpen) return;

        const deltaX = e.clientX - dragRef.current.startX;
        // Clamp visually
        const clampedDelta = Math.max(-60, Math.min(60, deltaX));

        gsap.to(innerPadRef.current, { x: clampedDelta, duration: 0.1, ease: "power1.out" });

        // Continuous Trigger Zones
        if (deltaX > 40) {
            startContinuousMove(1); // Right -> Next
        } else if (deltaX < -40) {
            startContinuousMove(-1); // Left -> Prev
        } else {
            stopContinuousMove(); // In deadzone
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isPreviewOpen) return;

        stopContinuousMove();
        setIsDragging(false);

        const wasTap = Math.abs(e.clientX - dragRef.current.startX) < 5;

        dragRef.current.active = false;
        // Spring back
        gsap.to(innerPadRef.current, { x: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });

        if (wasTap) {
            togglePreview();
        }
    };

    // --- AUTO-ROTATION REMOVED --- 

    // --- INITIALIZE GSAP STATES ---
    React.useLayoutEffect(() => {
        if (outerRingRef.current && innerPadRef.current) {
            gsap.set(outerRingRef.current, { clipPath: "circle(50% at 50% 50%)" });
            gsap.set(innerPadRef.current, { clipPath: "circle(40% at 50% 50%)" });
        }
        if (modalRef.current) {
            // Strictly hide modal initially
            gsap.set(modalRef.current, { autoAlpha: 0, y: 100 });
        }
        if (bannerRef.current) {
            // Initialize banner state via GSAP to ensure tweens work predictably
            gsap.set(bannerRef.current, {
                opacity: 0,
                scale: 1.1,
                filter: "blur(64px) brightness(0.15) saturate(1.8)"
            });
        }
        if (menuLabelRef.current) gsap.set(menuLabelRef.current, { y: 0, opacity: 1 });
    }, []);

    // --- PREVIEW TOGGLE ANIMATION ---
    const togglePreview = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        const opening = !isPreviewOpen;
        setIsPreviewOpen(opening);
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

        gsap.killTweensOf([
            outerRingRef.current,
            innerPadRef.current,
            modalRef.current,
            bannerRef.current,
            topHudRef.current,
            ...itemsRef.current
        ]);

        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false),
            defaults: { ease: "power3.inOut", force3D: true }
        });

        // ANIMATE CONTROLLER
        if (outerRingRef.current && innerPadRef.current) {
            gsap.to(outerRingRef.current, {
                clipPath: opening ? "circle(0% at 50% 50%)" : "circle(50% at 50% 50%)",
                duration: 0.75,
                ease: "power3.inOut",
                force3D: true
            });
            gsap.to(innerPadRef.current, {
                clipPath: opening ? "circle(50% at 50% 50%)" : "circle(40% at 50% 50%)",
                duration: 0.75,
                ease: "power3.inOut",
                force3D: true
            });
        }

        if (opening) {
            // OPENING SEQUENCE

            // 1. Fade out inactive items
            itemsRef.current.forEach((item, i) => {
                if (i === currentIndex || !item) return;
                tl.to(item, { opacity: 0, scale: 0.8, duration: 0.5, force3D: true }, 0);
            });

            // 2. Animate Active Item -> Tuck into Bottom Right Corner (Album Cover Style)
            // Responsive Tuck: On mobile, just fade it out/down to clear the stage.
            if (itemsRef.current[currentIndex]) {
                tl.to(itemsRef.current[currentIndex], {
                    x: isMobile ? 80 : 600,
                    y: isMobile ? 180 : 300,
                    z: 0,
                    rotateY: isMobile ? 0 : -15,
                    scale: isMobile ? 0.15 : 0.25,
                    opacity: 1, // Visible on mobile (Minsized)
                    duration: 1.0, ease: 'expo.out', force3D: true
                }, 0);
            }

            // 3. Banner & Modal
            // Reveal Banner (Clear & Bright) + Reveal Modal (Projection)
            tl.to(bannerRef.current, {
                opacity: 1,
                scale: 1,
                filter: "blur(0px) brightness(1) saturate(1)", // Crystal clear
                duration: 1.2,
                force3D: true
            }, 0)
                .to(modalRef.current, {
                    autoAlpha: 1, // Visible
                    y: 0,
                    duration: 0.8,
                    ease: 'expo.out',
                    force3D: true
                }, 0.1);

            // 4. Secondary UI fade out (Include Top HUD)
            tl.to(menuLabelRef.current, { opacity: 0, y: -20, duration: 0.3 }, 0)
                .to(topHudRef.current, { opacity: 0, y: -50, duration: 0.5 }, 0) // Hide Top HUD
                .to(navArrowsRef.current, { opacity: 0, scale: 0.8, duration: 0.4 }, 0)
                .to('.joystick-crosshair', { opacity: 0, duration: 0.3 }, 0)
                .to('.close-line-1', { width: 56, rotate: 45, duration: 0.5, ease: 'back.out' }, 0.2)
                .to('.close-line-2', { width: 56, rotate: -45, duration: 0.5, ease: 'back.out' }, 0.2);

        } else {
            // CLOSING SEQUENCE

            // 1. Hide Modal & Reset Banner to blurred background (or hidden)
            tl.to(modalRef.current, {
                autoAlpha: 0,
                y: 50,
                duration: 0.5,
                ease: 'power3.in',
                force3D: true,
            }, 0)
                .to(bannerRef.current, {
                    opacity: 0, // Go back to dark/void
                    scale: 1.1,
                    filter: "blur(64px) brightness(0.15) saturate(1.8)", // Reset blur state
                    duration: 1.0,
                    force3D: true
                }, 0);

            // 2. Restore UI (Include Top HUD)
            tl.to(navArrowsRef.current, { opacity: 1, scale: 1, duration: 0.5 }, 0.3)
                .to(topHudRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2) // Show Top HUD
                .to(menuLabelRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.3)
                .to('.joystick-crosshair', { opacity: 1, duration: 0.4 }, 0.3)
                .to('.close-line-1, .close-line-2', { width: 0, rotate: 0, duration: 0.4 }, 0);

            // 3. Restore gallery items to 3D Cylinder state
            itemsRef.current.forEach((item, idx) => {
                if (!item) return;
                const active = idx === currentIndex;
                // Recalculate cylinder position
                const total = PRODUCTS.length;
                let d = idx - currentIndex;
                const half = total / 2;
                if (d > half) d -= total;
                if (d < -half) d += total;

                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const spacingDeg = isMobile ? 55 : 35;
                const angle = d * spacingDeg;
                const rad = angle * (Math.PI / 180);
                const radius = isMobile ? 420 : 1100;
                const x = Math.sin(rad) * radius;
                const z = (Math.cos(rad) * radius) - radius;
                const rotateY = angle;
                const opacity = Math.abs(angle) > (isMobile ? 85 : 100) ? 0 : 1;
                const scale = active ? (isMobile ? 0.65 : 1.15) : (isMobile ? 0.45 : 0.9);
                const yOffset = isMobile ? -60 : 0;

                tl.to(item, {
                    x: x, y: yOffset, z: z, rotateY: rotateY, scale: scale, opacity: opacity,
                    zIndex: 1000 + Math.round(z), duration: 0.9, ease: 'expo.out', force3D: true
                }, 0.2);
            });
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-neutral-950 overflow-hidden flex flex-col items-center justify-center font-sans tracking-tight z-[2000]">
            {/* CINEMATIC BACKGROUND BANNER */}
            <div
                ref={bannerRef}
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ willChange: 'opacity, transform, filter' }} // Performance Hint
            >
                <Image
                    src={PRODUCTS[currentIndex].src}
                    alt="Background"
                    fill
                    className="object-cover" // Removed blur classes to let GSAP handle it
                    priority
                    unoptimized
                />
            </div>

            {/* --- CYBER BACKGROUND DESIGN (OVERLAY) --- */}
            {/* Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#10b98130,transparent_50%),radial-gradient(circle_at_bottom_right,#3b82f630,transparent_50%)] z-0 pointer-events-none mix-blend-screen" />
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

            {/* TOP HUD */}
            <div
                ref={topHudRef}
                className="absolute top-8 left-8 right-8 md:top-12 md:left-12 md:right-12 z-[100] flex justify-between items-start pointer-events-none scale-75 md:scale-100 origin-top"
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] md:tracking-[0.5em] text-emerald-500 font-bold uppercase">
                            OFFICIAL_GALLERY_MODE
                        </span>
                    </div>
                    <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter italic leading-tight">
                        VARNOTHSAVA 2K26<br />
                        <span className="text-emerald-500">MEMORY ARCHIVE</span>
                    </h2>
                </div>
                <div className="text-right">
                    <span className="text-[9px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] text-emerald-500/40 uppercase mb-2 md:mb-4 block">
                        MEMORY_ID: {currentIndex + 1}
                    </span>
                    <div className="text-white font-black text-4xl md:text-6xl tracking-tighter flex items-baseline gap-2">
                        {String(currentIndex + 1).padStart(2, '0')}
                        <span className="text-white/10 text-xl md:text-2xl font-light">/ {PRODUCTS.length}</span>
                    </div>
                </div>
            </div>

            {/* INFINITE GALLERY SLIDER */}
            <div
                ref={sliderRef}
                className="relative w-full h-full flex items-center justify-center z-10 -translate-y-[15%] md:-translate-y-[8%]"
                style={{ perspective: '2000px' }}
            >
                {PRODUCTS.map((p, idx) => (
                    <div
                        key={p.id}
                        ref={el => { itemsRef.current[idx] = el; }}
                        className="absolute flex items-center justify-center pointer-events-none"
                        style={{
                            width: '440px',
                            height: '580px',
                            transformStyle: 'preserve-3d',
                            willChange: 'transform, opacity', // Updated Performance Hint
                        }}
                    >
                        <div className="relative w-full h-full max-w-full max-h-full bg-neutral-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-[6px] border-white bg-white shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={p.src}
                                alt={p.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Text and Gradient Removed for clean 4K View */}
                        </div>
                    </div>
                ))}
            </div>

            {/* GLASSMORPHISM PREVIEW MODAL */}
            <div
                ref={modalRef}
                className="absolute inset-0 z-[5000] flex items-center justify-center pointer-events-none"
                style={{
                    transform: 'translateY(100px)',
                    willChange: 'transform, opacity, visibility' // Performance Hint
                }}
            >
                {/* CLEAN FULL-SCREEN PROJECTION - NO BOX */}
                <div className={cn("relative w-[95vw] flex items-center justify-center filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300", isPortrait ? "h-[70vh] mb-28 md:h-[95vh] md:mb-0" : "h-[65vh] mb-32 md:h-[95vh] md:mb-0")}>
                    <Image
                        src={PRODUCTS[currentIndex].src}
                        alt="Preview"
                        fill
                        className="object-contain" // Maximize size, no cropping, transparent sides
                        quality={100}
                        priority
                        unoptimized
                        onLoadingComplete={(img) => setIsPortrait(img.naturalHeight > img.naturalWidth)}
                    />
                </div>
            </div>
            {/* JOYSTICK CONTROLLER */}
            <div
                className="fixed z-[5000] flex flex-col items-center gap-1 transition-all duration-300 md:gap-6 md:right-12 md:top-1/2 md:-translate-y-1/2 md:scale-[0.8] left-1/2 -translate-x-1/2 scale-[0.6]"
                style={{ zIndex: 5000, bottom: '160px' }}
            >
                {/* Label */}
                <div
                    ref={menuLabelRef}
                    className="text-[10px] md:text-[12px] font-mono tracking-[1em] md:tracking-[1.5em] text-emerald-400 font-black uppercase drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                >
                    DRAG_NAV
                </div>

                {/* Controller Base */}
                <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                    {/* Navigation Arrows */}
                    <div
                        ref={navArrowsRef}
                        className="absolute inset-x-[-12px] md:inset-x-[-20px] top-1/2 -translate-y-1/2 flex justify-between z-50 pointer-events-none"
                    >
                        <button
                            onClick={() => move(-1)}
                            className="p-4 md:p-8 text-white/30 hover:text-emerald-500 transition-all hover:scale-125 md:hover:scale-150 active:scale-90 pointer-events-auto cursor-pointer"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={28} strokeWidth={3} className="md:w-[40px] md:h-[40px]" />
                        </button>
                        <button
                            onClick={() => move(1)}
                            className="p-4 md:p-8 text-white/30 hover:text-emerald-500 transition-all hover:scale-125 md:hover:scale-150 active:scale-90 pointer-events-auto cursor-pointer"
                            aria-label="Next"
                        >
                            <ChevronRight size={28} strokeWidth={3} className="md:w-[40px] md:h-[40px]" />
                        </button>
                    </div>

                    {/* Outer Ring - Made Stronger & Interactive Safe */}
                    <div
                        ref={outerRingRef}
                        className="absolute inset-0 rounded-full border-2 border-white/30 bg-black/70 shadow-[0_40px_100px_rgba(0,0,0,0.9)] backdrop-blur-3xl pointer-events-none"
                        style={{ willChange: 'clip-path, transform' }} // Performance Hint
                    />

                    {/* Central Pad - DRAGGABLE */}
                    <div className="relative z-50"> {/* Wrapper to avoid button defaults interfering with pointer events nicely */}
                        <button
                            ref={innerPadRef}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            className="relative rounded-full bg-emerald-500/5 border-2 border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.2)] flex items-center justify-center group cursor-grab active:cursor-grabbing"
                            style={{
                                width: '60px',
                                height: '60px',
                                willChange: 'transform',
                                touchAction: 'none' // Critical for drag interactions
                            }}
                            aria-label="Joystick Control"
                        >
                            {/* ACTIVE PULSE GLOW */}
                            <div className={cn("absolute inset-0 rounded-full bg-emerald-500 blur-md transition-all duration-300", isDragging ? "opacity-60 scale-150 animate-pulse" : "opacity-0 scale-100")} />

                            {/* Crosshair */}
                            <div className="joystick-crosshair absolute inset-x-0 h-0.5 bg-emerald-500/20 top-1/2 -translate-y-1/2 scale-x-150 pointer-events-none" />
                            <div className="joystick-crosshair absolute inset-y-0 w-0.5 bg-emerald-500/20 left-1/2 -translate-x-1/2 scale-y-150 pointer-events-none" />

                            {/* Center Icon */}
                            <div className="relative flex items-center justify-center pointer-events-none">
                                {/* Close X Lines */}
                                <div className="close-line-1 absolute h-1.5 bg-white rounded-full transition-all w-0" />
                                <div className="close-line-2 absolute h-1.5 bg-white rounded-full transition-all w-0" />

                                {/* Dot when closed */}
                                {!isPreviewOpen && (
                                    <div className="w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981] group-hover:scale-125 transition-all" />
                                )}
                            </div>
                        </button>

                        {/* Decorative Radar Ring */}
                        <div className="absolute inset-[-30px] md:inset-[-40px] border border-emerald-500/10 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
                    </div>
                </div>

                {/* Global Styles */}
                <style jsx global>{`
                body { 
                    background: #050805 !important; 
                    overflow: hidden !important; 
                }
            `}</style>
            </div>
        </div>
    );
}
