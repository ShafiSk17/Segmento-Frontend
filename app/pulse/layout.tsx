import PulseNavbar from "@/components/pulse/Navbar";

export default function PulseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PulseNavbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-6 text-center text-sm text-gray-500">
                © 2026 SegmentoPulse. All rights reserved.
            </footer>
        </div>
    );
}
