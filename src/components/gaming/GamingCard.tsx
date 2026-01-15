'use client'

import { useState } from "react";
import "@/styles/gaming-card.css";

interface GamingCardProps {
    characterName?: string;
    title?: string;
    rarity?: "common" | "rare" | "epic" | "legendary";
    power?: number;
    defense?: number;
    speed?: number;
    image?: string;
    onPlay?: () => void;
}

const rarityColors = {
    common: { primary: "120 40% 50%", glow: "120 40% 40%" },
    rare: { primary: "210 100% 50%", glow: "210 100% 40%" },
    epic: { primary: "270 80% 60%", glow: "270 80% 50%" },
    legendary: { primary: "45 100% 50%", glow: "45 100% 40%" },
};

export default function GamingCard({
    characterName = "SHADOW KNIGHT",
    title = "Guardian of the Void",
    rarity = "legendary",
    power = 85,
    defense = 70,
    speed = 90,
    image = "/cultural_hero.png", // Fallback to an existing image
    onPlay,
}: GamingCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const colors = rarityColors[rarity];

    return (
        <div
            className="gaming-card-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                "--rarity-primary": colors.primary,
                "--rarity-glow": colors.glow,
            } as React.CSSProperties}
        >
            {/* Outer geometric frame */}
            <div className={`gaming-card ${isHovered ? "gaming-card-hover" : ""}`}>
                {/* Corner accents */}
                <div className="corner-accent corner-tl" />
                <div className="corner-accent corner-tr" />
                <div className="corner-accent corner-bl" />
                <div className="corner-accent corner-br" />

                {/* Rarity indicator */}
                <div className="rarity-badge">
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest">
                        {rarity}
                    </span>
                </div>

                {/* Main content */}
                <div className="card-inner">
                    {/* Character image with hexagonal mask */}
                    <div className="hex-image-container">
                        <div className="hex-frame">
                            <div className="hex-inner">
                                {image ? (
                                    <img src={image} alt={characterName} className="character-image" />
                                ) : (
                                    <div className="placeholder-image" />
                                )}
                            </div>
                        </div>
                        {/* Floating geometric elements */}
                        <div className="geo-element geo-1" />
                        <div className="geo-element geo-2" />
                        <div className="geo-element geo-3" />
                    </div>

                    {/* Character info */}
                    <div className="character-info">
                        <h2 className="character-name text-white font-display uppercase tracking-tighter">{characterName}</h2>
                        <p className="character-title font-body opacity-60 text-xs italic">{title}</p>
                    </div>

                    {/* Stats bar */}
                    <div className="stats-container">
                        <div className="stat-item">
                            <div className="stat-icon stat-power text-red-500">⚔</div>
                            <div className="stat-bar-bg">
                                <div
                                    className="stat-bar stat-bar-power"
                                    style={{ width: `${power}%` }}
                                />
                            </div>
                            <span className="stat-value">{power}</span>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon stat-defense text-blue-500">🛡</div>
                            <div className="stat-bar-bg">
                                <div
                                    className="stat-bar stat-bar-defense"
                                    style={{ width: `${defense}%` }}
                                />
                            </div>
                            <span className="stat-value">{defense}</span>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon stat-speed text-yellow-500">⚡</div>
                            <div className="stat-bar-bg">
                                <div
                                    className="stat-bar stat-bar-speed"
                                    style={{ width: `${speed}%` }}
                                />
                            </div>
                            <span className="stat-value">{speed}</span>
                        </div>
                    </div>

                    {/* Action button */}
                    <button onClick={onPlay} className="play-button mt-4">
                        <span className="play-button-text">DEPLOY</span>
                        <div className="play-button-shine" />
                    </button>
                </div>

                {/* Animated border effect */}
                <div className="animated-border" />
            </div>
        </div>
    );
}
