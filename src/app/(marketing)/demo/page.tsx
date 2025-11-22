'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Zap, Users, Package, GitBranch, SkipBack, SkipForward } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(3) // Start with jungle video
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLIFrameElement>(null)

  const demos = [
    {
      title: "3D Model Upload & Rendering",
      description: "See how easy it is to upload and render 3D models in the cloud",
      duration: "2:30",
      videoId: "dQw4w9WgXcQ",
      features: ["Drag & drop upload", "Instant cloud rendering", "Multiple file formats"]
    },
    {
      title: "Real-time Collaboration",
      description: "Watch multiple users collaborate on the same 3D scene simultaneously",
      duration: "1:45",
      videoId: "9bZkp7q19f0",
      features: ["Live cursors", "Real-time comments", "Shared viewport"]
    },
    {
      title: "Version Control System",
      description: "Git-like version control for 3D projects with visual diffs",
      duration: "3:15",
      videoId: "SWYqp7iY_Tc",
      features: ["Branch management", "Visual diffs", "Commit history"]
    },
    {
      title: "Wildlife & Nature Rendering",
      description: "Experience stunning 4K jungle and wildlife scenes with realistic lighting",
      duration: "10:00",
      videoId: "LXb3EKWsInQ",
      features: ["4K Ultra HD quality", "Realistic animal models", "Dynamic lighting"]
    },
    {
      title: "Asset Library & Materials",
      description: "Explore thousands of 3D assets and professional materials",
      duration: "2:00",
      videoId: "YQHsXMglC9A",
      features: ["Material library", "3D model assets", "Lighting presets"]
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              See TEELI in Action
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12">
            Watch interactive demos showcasing TEELI's powerful 3D rendering and collaboration features.
            <br className="hidden sm:block" />
            <span className="text-purple-300">No signup required.</span>
          </p>
        </div>
      </section>

      {/* Main Demo Player */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Video Player */}
            <div className="relative aspect-video bg-zinc-800 rounded-t-3xl overflow-hidden group">
              <iframe
                ref={videoRef}
                src={`https://www.youtube.com/embed/${demos[currentDemo].videoId}?autoplay=0&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
                title={demos[currentDemo].title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* Custom Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Play/Pause Button Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="size-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="size-10 text-white ml-1" />
                    ) : (
                      <Play className="size-10 text-white ml-2" />
                    )}
                  </button>
                </div>
                
                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-300" style={{width: '35%'}} />
                      </div>
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-white hover:text-purple-300 transition-colors">
                          <SkipBack className="size-5" />
                        </button>
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-white hover:text-purple-300 transition-colors"
                        >
                          {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
                        </button>
                        <button className="text-white hover:text-purple-300 transition-colors">
                          <SkipForward className="size-5" />
                        </button>
                        <span className="text-white text-sm font-medium">2:45 / {demos[currentDemo].duration}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:text-purple-300 transition-colors"
                        >
                          {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                        </button>
                        <button className="text-white hover:text-purple-300 transition-colors">
                          <Maximize className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">{demos[currentDemo].title}</h3>
                  <p className="text-zinc-400 mb-6">{demos[currentDemo].description}</p>
                  <ul className="space-y-2">
                    {demos[currentDemo].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-zinc-300">
                        <div className="size-2 bg-purple-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 text-lg py-6 mb-4">
                      Try This Feature
                      <ArrowRight className="size-5" />
                    </Button>
                  </Link>
                  <Link href="/project/demo">
                    <Button size="lg" variant="outline" className="w-full border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-100 hover:text-white gap-2 text-lg py-6">
                      <RotateCcw className="size-5" />
                      Interactive Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Selection */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Choose Your Demo
              </span>
            </h2>
            <p className="text-zinc-400 text-xl">Explore different aspects of TEELI's capabilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {demos.map((demo, index) => {
              const icons = [Zap, Users, GitBranch, Package, Package]
              const Icon = icons[index]
              
              return (
                <div
                  key={index}
                  onClick={() => setCurrentDemo(index)}
                  className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                    currentDemo === index
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-800/30'
                  }`}
                >
                  <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${
                    currentDemo === index ? 'bg-purple-500' : 'bg-zinc-800'
                  }`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{demo.title}</h3>
                  <p className="text-sm text-zinc-400 mb-3">{demo.description}</p>
                  <div className="text-xs text-zinc-500">{demo.duration}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-purple-900/20 via-zinc-900 to-cyan-900/20 p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
            
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Ready to start creating?
                </span>
              </h2>
              <p className="text-zinc-400 text-xl mb-8 max-w-2xl mx-auto">
                Experience the full power of TEELI with your own 3D projects.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 text-lg px-8 py-6">
                    Start Free Trial
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-zinc-600 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-100 hover:text-white gap-2 text-lg px-8 py-6">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}