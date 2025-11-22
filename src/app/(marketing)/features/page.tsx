'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, Users, Package, GitBranch, BarChart3, Shield, MessageCircle, Palette, Cloud, Globe, Smartphone, Eye, Camera, Settings, Code, Database, Lock } from "lucide-react";
import { useState } from "react";

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('rendering')

  const categories = [
    { id: 'rendering', label: 'Rendering', icon: Zap },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'assets', label: 'Assets', icon: Package },
    { id: 'workflow', label: 'Workflow', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const features = {
    rendering: [
      {
        icon: Zap,
        title: "Real-time Ray Tracing",
        description: "Cinema-grade rendering with SSAO, Bloom, and ACES tone mapping",
        details: ["WebGL 2.0 acceleration", "HDR environment mapping", "PBR material system", "Real-time shadows"]
      },
      {
        icon: Eye,
        title: "Advanced Post-Processing",
        description: "Professional visual effects and filters",
        details: ["Depth of field", "Motion blur", "Color grading", "Anti-aliasing"]
      },
      {
        icon: Camera,
        title: "Multiple Camera Views",
        description: "Orthographic and perspective cameras with smooth transitions",
        details: ["Free camera controls", "Preset viewpoints", "Animation paths", "VR/AR support"]
      }
    ],
    collaboration: [
      {
        icon: MessageCircle,
        title: "Real-time Comments",
        description: "Add contextual feedback directly on 3D models",
        details: ["3D annotations", "Thread discussions", "Mention teammates", "Status tracking"]
      },
      {
        icon: Users,
        title: "Team Workspaces",
        description: "Organize projects and collaborate with your team",
        details: ["Role-based permissions", "Team libraries", "Shared assets", "Activity feeds"]
      },
      {
        icon: Globe,
        title: "Live Collaboration",
        description: "Work together in real-time from anywhere",
        details: ["Simultaneous editing", "Cursor tracking", "Voice chat", "Screen sharing"]
      }
    ],
    assets: [
      {
        icon: Package,
        title: "3D Model Library",
        description: "Thousands of ready-to-use 3D models and components",
        details: ["Furniture & decor", "Architectural elements", "Vehicles & machinery", "Characters & props"]
      },
      {
        icon: Palette,
        title: "Material Library",
        description: "Professional PBR materials and textures",
        details: ["Wood & metal", "Fabric & leather", "Glass & plastic", "Custom materials"]
      },
      {
        icon: Settings,
        title: "Lighting Presets",
        description: "Studio-quality lighting setups for any scene",
        details: ["Studio lighting", "Natural environments", "Dramatic moods", "Custom HDRI"]
      }
    ],
    workflow: [
      {
        icon: GitBranch,
        title: "Version Control",
        description: "Git-like versioning for 3D projects",
        details: ["Branch management", "Commit history", "Merge conflicts", "Diff visualization"]
      },
      {
        icon: Code,
        title: "API Integration",
        description: "Connect with your existing tools and workflows",
        details: ["REST API", "Webhooks", "CLI tools", "Plugin system"]
      },
      {
        icon: Smartphone,
        title: "Mobile & AR",
        description: "View and share projects on any device",
        details: ["Mobile viewer", "AR preview", "QR sharing", "Offline mode"]
      }
    ],
    analytics: [
      {
        icon: BarChart3,
        title: "Performance Monitoring",
        description: "Real-time performance metrics and optimization",
        details: ["FPS tracking", "Memory usage", "Load times", "Bottleneck detection"]
      },
      {
        icon: Cloud,
        title: "Usage Analytics",
        description: "Insights into team productivity and project metrics",
        details: ["Time tracking", "Collaboration stats", "Asset usage", "Export reports"]
      },
      {
        icon: Eye,
        title: "Viewer Analytics",
        description: "Track how users interact with your 3D content",
        details: ["View duration", "Interaction heatmaps", "Device analytics", "Geographic data"]
      }
    ],
    security: [
      {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade security for your sensitive projects",
        details: ["256-bit encryption", "SOC 2 compliance", "GDPR compliant", "Regular audits"]
      },
      {
        icon: Lock,
        title: "Access Control",
        description: "Granular permissions and user management",
        details: ["Role-based access", "Project permissions", "IP restrictions", "SSO integration"]
      },
      {
        icon: Database,
        title: "Data Protection",
        description: "Your data is secure and always backed up",
        details: ["Automatic backups", "Data encryption", "Disaster recovery", "99.9% uptime"]
      }
    ]
  }

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
              Powerful Features
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12">
            Everything you need to create, collaborate, and deliver stunning 3D experiences. 
            Professional tools that work seamlessly together.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features[activeCategory as keyof typeof features].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="size-8 text-purple-400" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-zinc-400 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                          <div className="size-1.5 rounded-full bg-purple-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Seamless Integration
              </span>
            </h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
              Connect with your favorite tools and platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[
              { name: 'Blender', logo: 'https://download.blender.org/branding/community/blender_community_badge_white.svg' },
              { name: 'Maya', logo: 'https://damassets.autodesk.net/content/dam/autodesk/www/products/maya/maya-2023-social-640x640.jpg' },
              { name: 'Cinema 4D', logo: 'https://www.maxon.net/fileadmin/redaktion/bilder/logos/c4d_logo_white.svg' },
              { name: 'Figma', logo: 'https://cdn.worldvectorlogo.com/logos/figma-5.svg' },
              { name: 'Slack', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
              { name: 'Notion', logo: 'https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg' },
              { name: 'GitHub', logo: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg' },
              { name: 'Jira', logo: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg' },
              { name: 'Trello', logo: 'https://cdn.worldvectorlogo.com/logos/trello.svg' },
              { name: 'Discord', logo: 'https://cdn.worldvectorlogo.com/logos/discord-6.svg' },
              { name: 'Teams', logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg' },
              { name: 'Zoom', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg' }
            ].map((tool, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors group">
                <div className="size-12 rounded-xl mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={tool.logo} 
                    alt={tool.name}
                    className="size-8 object-contain filter brightness-75 group-hover:brightness-100 transition-all"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="size-6 bg-zinc-600 rounded fallback hidden" />
                </div>
                <div className="text-sm text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">{tool.name}</div>
              </div>
            ))}
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
                  Ready to get started?
                </span>
              </h2>
              <p className="text-zinc-400 text-xl mb-8 max-w-2xl mx-auto">
                Experience all these features and more. Start your free trial today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 text-lg px-8 py-6">
                    Start Free Trial
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link href="/project/demo">
                  <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white gap-2 text-lg px-8 py-6">
                    View Demo
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