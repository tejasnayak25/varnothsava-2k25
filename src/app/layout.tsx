import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { InnovativeNavbar } from "@/components/layout/InnovativeNavbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScroll } from "../components/ui/SmoothScroll";
import ClientLayoutOverlays from "@/components/layout/ClientLayoutOverlays";

import { CustomCursor } from "@/components/layout/CustomCursor";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Varnothsava 2026 | National Level Techno-Cultural Fest",
    description: "Experience the ultimate fusion of technology and culture at Varnothsava 2026. Join the celebration of innovation and art.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.className} bg-[#050805] text-white antialiased`}>
                <AppProvider>
                    <ClientLayoutOverlays />
                    <CustomCursor />


                    <SmoothScroll>
                        <InnovativeNavbar />
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </SmoothScroll>
                </AppProvider>
            </body>
        </html>
    );
}

