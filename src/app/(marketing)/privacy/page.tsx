import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Users, Database, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="border-b border-zinc-800/50 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-8 animate-bounce">
            <Shield className="size-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-zinc-400 text-xl mb-8">Your data security is our top priority</p>
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-300">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8">
          {/* Section 1 */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Database className="size-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Information We Collect</h2>
              </div>
              <p className="text-zinc-300 text-lg mb-6">
                At TEELI, we collect information you provide directly to us, such as when you create an account, 
                upload 3D models, or contact us for support.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Account information (name, email, password)',
                  '3D models and project files you upload',
                  'Usage data and analytics',
                  'Communication preferences'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-700/30 transition-colors">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="size-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <p className="text-zinc-300 text-lg mb-6">We use the information we collect to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Provide and maintain our 3D rendering services',
                  'Process and render your 3D models',
                  'Communicate with you about your account',
                  'Improve our services and develop new features',
                  'Ensure security and prevent fraud'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-700/30 transition-colors">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-green-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="size-6 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Data Security</h2>
              </div>
              <p className="text-zinc-300 text-lg mb-6">
                We implement industry-standard security measures to protect your data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: '256-bit SSL', desc: 'Encryption for data transmission' },
                  { title: 'Encrypted Storage', desc: 'All 3D models and files protected' },
                  { title: 'Security Audits', desc: 'Regular monitoring and testing' },
                  { title: 'SOC 2 Compliance', desc: 'Industry standard protocols' }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-zinc-800/30 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4 & 5 Combined */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-orange-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="size-6 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Data Sharing</h2>
                </div>
                <p className="text-zinc-300 mb-6">
                  We do not sell, trade, or rent your personal information to third parties.
                </p>
                <div className="space-y-3">
                  {[
                    'With your explicit consent',
                    'To comply with legal obligations',
                    'To protect our rights and safety',
                    'With trusted service providers'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="size-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Your Rights</h2>
                </div>
                <p className="text-zinc-300 mb-6">You have the right to:</p>
                <div className="space-y-3">
                  {[
                    'Access your personal data',
                    'Correct inaccurate information',
                    'Delete your account and data',
                    'Export your 3D models',
                    'Opt-out of marketing'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-purple-900/30 via-zinc-900/50 to-cyan-900/30 p-8 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Mail className="size-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Questions? We're Here to Help</h2>
              <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy, our team is ready to assist you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-purple-500/50 transition-colors">
                  <h3 className="font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-purple-300">privacy@teeli.net</p>
                </div>
                <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-cyan-500/50 transition-colors">
                  <h3 className="font-semibold text-white mb-2">Response Time</h3>
                  <p className="text-cyan-300">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}