"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-white">TEELI</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/features">
              <p className="text-zinc-300 hover:text-white transition-colors">
                Features
              </p>
            </Link>
            <Link href="/pricing">
              <p className="text-zinc-300 hover:text-white transition-colors">
                Pricing
              </p>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-300">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-50"
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 text-white absolute transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`h-6 w-6 text-white absolute transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </div>
            </Button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 right-0 z-[60] transition-all duration-500 ease-out ${
          isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible'
        }`}>
          <div className="bg-black/95 backdrop-blur-xl border-b border-zinc-800 mx-4 mt-2 rounded-2xl overflow-hidden shadow-2xl">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
            
            <div className="relative p-6 space-y-4">
              {/* Menu Items */}
              <div className={`transform transition-all duration-300 delay-75 ${
                isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <Link href="/features" onClick={() => setIsMenuOpen(false)}>
                  <div className="py-4 px-6 text-2xl font-bold text-white hover:text-purple-300 hover:bg-white/5 rounded-xl transition-all duration-200 hover:scale-105">
                    Features
                  </div>
                </Link>
              </div>
              
              <div className={`transform transition-all duration-300 delay-150 ${
                isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
                  <div className="py-4 px-6 text-2xl font-bold text-white hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-all duration-200 hover:scale-105">
                    Pricing
                  </div>
                </Link>
              </div>
              
              <div className={`transform transition-all duration-300 delay-225 ${
                isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <div className="py-4 px-6 text-xl font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer">
                    Login
                  </div>
                </Link>
              </div>
              
              <div className={`transform transition-all duration-300 delay-300 ${
                isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
