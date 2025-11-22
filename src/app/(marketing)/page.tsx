'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, MessageCircle, Database, Zap, Eye, Play, Users, Shield, Globe, Palette, Package, GitBranch, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [currentTitle, setCurrentTitle] = useState(0)

  const titles = [
    { main: "3D Rendering", sub: "Made Simple" },
    { main: "Cloud-Powered", sub: "3D Creation" },
    { main: "Real-Time", sub: "Collaboration" },
    { main: "Professional", sub: "3D Workflow" }
  ]

  useEffect(() => {
    setIsVisible(true)
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, 3000)
    
    const titleInterval = setInterval(() => {
      setCurrentTitle(prev => (prev + 1) % titles.length)
    }, 4000)
    
    return () => {
      clearInterval(featureInterval)
      clearInterval(titleInterval)
    }
  }, [])

  const features = [
    { icon: Zap, title: "Real-time Rendering", desc: "Instant 3D visualization" },
    { icon: Users, title: "Team Collaboration", desc: "Work together seamlessly" },
    { icon: Package, title: "Asset Library", desc: "Reusable 3D components" },
    { icon: GitBranch, title: "Version Control", desc: "Track every change" }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 pt-24">
        <div className="container relative z-10 max-w-7xl mx-auto">
          <div className={`flex flex-col items-center space-y-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm hover:bg-purple-500/20 transition-colors">
              <Sparkles className="size-4 text-purple-400 animate-spin" />
              <span className="text-sm text-purple-300 font-medium">Next-Gen 3D Collaboration Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight min-h-[200px] sm:min-h-[300px] flex flex-col justify-center">
              <div className="overflow-hidden">
                <span 
                  key={`main-${currentTitle}`}
                  className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent animate-in slide-in-from-bottom-8 fade-in duration-1000"
                >
                  {titles[currentTitle].main}
                </span>
              </div>
              <div className="overflow-hidden">
                <span 
                  key={`sub-${currentTitle}`}
                  className="block bg-gradient-to-r from-cyan-200 via-purple-200 to-white bg-clip-text text-transparent animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300"
                >
                  {titles[currentTitle].sub}
                </span>
              </div>
            </h1>

            {/* Subtext */}
            <p className="max-w-3xl text-lg md:text-xl text-zinc-400 leading-relaxed">
              Professional 3D rendering, real-time collaboration, and version control.
              <br className="hidden sm:block" />
              <span className="text-purple-300">No downloads. No GPU required. Just create.</span>
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-300">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
                    activeFeature === index 
                      ? 'border-purple-500/50 bg-purple-500/10 text-purple-300' 
                      : 'border-zinc-800 bg-zinc-900/50'
                  }`}>
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{feature.title}</span>
                  </div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-purple-500/25 transition-all">
                  Start Creating Free
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-zinc-500 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-100 hover:text-white gap-2 text-lg px-8 py-6 backdrop-blur-sm">
                  <Play className="size-5" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-zinc-400">Projects Created</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-zinc-400">Countries</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-zinc-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Everything you need
              </span>
            </h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">Professional 3D tools that work seamlessly together</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Real-time Rendering */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="size-8 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Real-time Rendering</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">Cinema-grade post-processing with SSAO, Bloom, and ACES tone mapping. Get photorealistic results instantly in your browser.</p>
                <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm">WebGL</span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm">HDR</span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm">PBR</span>
                </div>
              </div>
            </div>

            {/* Collaboration */}
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="size-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="size-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
                <p className="text-zinc-400 leading-relaxed">Real-time comments, annotations, and version control. Work together like never before.</p>
              </div>
            </div>

            {/* Asset Library */}
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="size-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Asset Library</h3>
                <p className="text-zinc-400 leading-relaxed">Thousands of 3D models, materials, and lighting presets ready to use.</p>
              </div>
            </div>

            {/* Version Control */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-green-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="size-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GitBranch className="size-8 text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Git-like Version Control</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">Track every change, create branches, and merge with confidence. Never lose your work again.</p>
                <div className="mt-6 flex gap-2">
                  <span className="px-3 py-1 bg-green-500/10 text-green-300 rounded-full text-sm">Branches</span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-300 rounded-full text-sm">Commits</span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-300 rounded-full text-sm">Diffs</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="size-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="size-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Performance Analytics</h3>
                <p className="text-zinc-400 leading-relaxed">Real-time performance monitoring and carbon footprint tracking.</p>
              </div>
            </div>

            {/* Security */}
            <div className="lg:col-span-3 group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-red-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="size-8 text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Enterprise Security</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">Bank-grade encryption, SOC 2 compliance, and private cloud deployment options. Your data is always secure.</p>
                </div>
                <div className="hidden lg:flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">256-bit</div>
                    <div className="text-sm text-zinc-400">Encryption</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">SOC 2</div>
                    <div className="text-sm text-zinc-400">Compliant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-zinc-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-32 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-purple-900/20 via-zinc-900 to-cyan-900/20 p-16 md:p-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Start creating today
                </span>
              </h2>
              <p className="text-zinc-400 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of designers, architects, and teams who've transformed their 3D workflow with TEELI.
                <br className="hidden sm:block" />
                <span className="text-purple-300">No credit card required. Start free forever.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-white to-zinc-200 text-black hover:from-zinc-100 hover:to-zinc-300 gap-2 text-xl px-12 py-8 shadow-2xl hover:shadow-white/10 transition-all">
                    Get Started Free
                    <ArrowRight className="size-6" />
                  </Button>
                </Link>
                
                <div className="flex items-center gap-4 text-zinc-400">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">A</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">R</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">S</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">M</div>
                  </div>
                  <span className="text-sm">Beta testers</span>
                </div>
              </div>
              
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Shield className="size-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4" />
                  <span>Works in any browser</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="size-4" />
                  <span>Setup in 30 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}