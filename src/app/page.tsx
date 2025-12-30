import { Hero3D } from "@/components/sections/Hero3D"
import { UserDashboard } from "@/components/sections/UserDashboard"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-black">
            <Hero3D />
            <UserDashboard />
        </main>
    )
}
