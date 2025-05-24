import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Voice Feedback Platform",
  description: "Automated voice-based customer feedback collection and analysis platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 bg-[length:200%_200%] animate-gradient-move relative`}> 
        {/* Floating Glassmorphism Navbar */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl rounded-2xl bg-white/80 shadow-2xl border border-white/40 flex items-center justify-between px-8 py-4 text-blue-900 backdrop-blur-md">
          <Link href="/" className="text-2xl font-bold text-blue-800 tracking-tight drop-shadow-lg">Voice Feedback Platform</Link>
          <Link href="/login" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md">Login</Link>
        </nav>
        <main className="flex flex-col items-center justify-center pt-32 pb-32 min-h-[80vh] w-full max-w-5xl mx-auto px-4">
          {children}
        </main>
        {/* Floating Glassmorphism Footer */}
        <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl rounded-2xl bg-white/80 shadow-2xl border border-white/40 text-center text-blue-900 text-sm py-3 backdrop-blur-md">
          &copy; {new Date().getFullYear()} Voice Feedback Platform. All rights reserved.
        </footer>
      </body>
    </html>
  )
} 