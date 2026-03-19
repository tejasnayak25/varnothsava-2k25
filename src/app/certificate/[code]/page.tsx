'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Download, Share2, Loader2, AlertCircle } from 'lucide-react'

interface ParticipantData {
    name: string
    collegeName?: string
    college?: string
    profileCode: string
    hasPaid: boolean
}

export default function CertificatePage() {
    const params = useParams()
    const code = params?.code as string
    const [userData, setUserData] = useState<ParticipantData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!code) return

            try {
                const res = await fetch(`/api/user-by-code?code=${code}`)
                if (!res.ok) {
                    if (res.status === 404) {
                        setError('Certificate not found')
                    } else if (res.status === 403) {
                        setError('Certificate only available for paid participants')
                    } else {
                        setError('Failed to load certificate')
                    }
                    return
                }

                const data = await res.json()
                const user = data.user || data
                
                if (!user.hasPaid) {
                    setError('Certificate only available for paid participants')
                    setLoading(false)
                    return
                }
                
                setUserData(user)
            } catch (err) {
                setError('Error loading certificate. Please try again.')
                console.error('Error fetching user data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [code])

    const handleDownload = () => {
        if (userData?.profileCode) {
            window.open(`/api/certificates/download/${userData.profileCode}`, '_blank')
        }
    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/certificate/${code}`
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Varnothsava 2026 Certificate',
                    text: `Check out my official participation certificate from Varnothsava 2026!`,
                    url: shareUrl,
                })
            } catch (err) {
                console.error('Share failed:', err)
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl)
                alert('Certificate link copied to clipboard!')
            } catch (err) {
                console.error('Copy failed:', err)
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#09100d] to-[#0a1810] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-amber-400 animate-spin" />
                    <p className="text-white text-lg">Loading certificate...</p>
                </div>
            </div>
        )
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#09100d] to-[#0a1810] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                    <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white mb-2">Certificate Not Available</h2>
                    <p className="text-red-200">{error || 'Unable to load certificate'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#09100d] to-[#0a1810] py-8 md:py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                        Certificate of Participation
                    </h1>
                    <p className="text-amber-400 font-bold uppercase tracking-wider text-sm md:text-base">
                        Varnothsava 2026
                    </p>
                </div>

                {/* Certificate Preview */}
                <div className="mb-8 relative group">
                    <div className="relative bg-white/5 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative w-full aspect-[1.414/1] bg-gradient-to-br from-white/10 to-white/5">
                            <Image
                                src="/image_copy_7.png"
                                alt="Certificate Template"
                                fill
                                className="object-cover"
                                priority
                            />
                            
                            {/* Name Overlay */}
                            <div className="absolute left-[40.5%] top-[51.5%] -translate-y-1/2 w-[60%] text-left pointer-events-none">
                                <p className="text-[rgb(27,38,49)] font-serif font-black uppercase text-[8px] sm:text-[12px] md:text-[16px] lg:text-[20px] truncate leading-tight">
                                    {userData.name}
                                </p>
                            </div>

                            {/* College Overlay */}
                            <div className="absolute left-[20%] top-[57.5%] -translate-y-1/2 w-[60%] text-left pointer-events-none">
                                <p className="text-[rgb(81,90,90)] font-serif font-medium italic uppercase text-[6px] sm:text-[9px] md:text-[12px] lg:text-[15px] truncate leading-tight">
                                    {userData.collegeName || userData.college || 'INSTITUTION'}
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                    </div>
                    <div className="absolute -inset-1 bg-amber-500/10 rounded-2xl blur-xl -z-10" />
                </div>

                {/* Participant Info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-center">
                    <p className="text-white/60 text-sm mb-1">Participant</p>
                    <h2 className="text-2xl font-black text-white mb-4">{userData.name}</h2>
                    <p className="text-slate-400 text-sm">
                        {userData.collegeName || userData.college || 'Institution'}
                    </p>
                    <p className="text-amber-400 font-mono text-xs mt-4 tracking-wider">
                        ID: {userData.profileCode}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    <button
                        onClick={handleDownload}
                        className="py-3 px-6 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-black uppercase text-sm tracking-widest rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>

                    <button
                        onClick={handleShare}
                        className="py-3 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase text-sm tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 size={18} />
                        Share Certificate
                    </button>
                </div>

                {/* Info */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center text-sm text-emerald-200">
                    <p>This certificate is proudly issued to recognize your participation in Varnothsava 2026</p>
                </div>
            </div>
        </div>
    )
}
