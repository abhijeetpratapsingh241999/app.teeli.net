import Link from "next/link";
import { ArrowLeft, FileText, Scale, Shield, CreditCard, AlertTriangle, Users, Mail, CheckCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-green-900/20" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mb-8 animate-bounce">
            <Scale className="size-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>
          <p className="text-zinc-400 text-xl mb-8">Clear, fair, and transparent terms for everyone</p>
          <div className="inline-flex items-center gap-2 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-300">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8">
          {/* Acceptance */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="size-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Acceptance of Terms</h2>
              </div>
              <p className="text-zinc-300 text-lg">
                By accessing and using TEELI's 3D rendering platform, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </div>
          </div>

          {/* License & Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="size-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Use License</h2>
                </div>
                <p className="text-zinc-300 mb-6">
                  Permission is granted to use TEELI for 3D rendering purposes. Under this license you may not:
                </p>
                <div className="space-y-3">
                  {[
                    'Modify or copy platform materials',
                    'Use without proper subscription',
                    'Reverse engineer software',
                    'Remove copyright notations'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-cyan-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="size-6 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">User Content</h2>
                </div>
                <p className="text-zinc-300 mb-6">
                  You retain ownership of all 3D models and content. By uploading, you grant us:
                </p>
                <div className="space-y-3">
                  {[
                    'Right to store and process content',
                    'Right to create data backups',
                    'Right to use anonymized data'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Prohibited Uses & Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-red-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="size-6 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Prohibited Uses</h2>
                </div>
                <p className="text-zinc-300 mb-6">You may not use TEELI for:</p>
                <div className="space-y-3">
                  {[
                    'Illegal or unauthorized purposes',
                    'Uploading malicious content',
                    'Violating IP rights',
                    'Unauthorized access attempts',
                    'Security interference'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-green-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="size-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Service Availability</h2>
                </div>
                <p className="text-zinc-300 mb-6">We strive for 99.9% uptime. We reserve the right to:</p>
                <div className="space-y-3">
                  {[
                    'Perform scheduled maintenance',
                    'Update platform features',
                    'Suspend for security reasons',
                    'Terminate violating accounts'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="size-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Billing and Payments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Secure Processing', desc: 'Payments via Stripe encryption' },
                  { title: 'Auto-Renewal', desc: 'Subscriptions renew automatically' },
                  { title: 'Refund Policy', desc: 'Fair refunds as per policy' },
                  { title: 'Price Changes', desc: '30 days advance notice' }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-zinc-800/30 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Final Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-orange-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scale className="size-6 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Liability</h2>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  TEELI shall not be liable for indirect, incidental, special, consequential, or punitive damages, 
                  including loss of profits, data, or goodwill.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 p-8 hover:border-pink-500/50 transition-all duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="size-12 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="size-6 text-pink-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Termination</h2>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  We may terminate accounts immediately for conduct violating these terms or harmful to users, 
                  us, or third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-blue-900/30 via-zinc-900/50 to-green-900/30 p-8 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Mail className="size-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Need Legal Assistance?</h2>
              <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
                Our legal team is available to clarify any terms or answer questions about our service agreement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-blue-500/50 transition-colors">
                  <h3 className="font-semibold text-white mb-2">Legal Team</h3>
                  <p className="text-blue-300">legal@teeli.net</p>
                </div>
                <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-green-500/50 transition-colors">
                  <h3 className="font-semibold text-white mb-2">Response Time</h3>
                  <p className="text-green-300">Within 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}