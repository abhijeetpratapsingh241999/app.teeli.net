'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check, Star, Zap, Users, Package, Shield, Crown, Rocket, Sparkles, Trophy, Gem } from "lucide-react";
import { useState } from "react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Beta",
      description: "Perfect for learners & exploration",
      price: { monthly: 0, annual: 0 },
      icon: Sparkles,
      color: "from-green-400 to-emerald-500",
      popular: false,
      features: [
        "3 Projects",
        "Basic 3D Viewer",
        "100 MB storage",
        "Preview render only",
        "Basic annotations",
        "Basic import pipeline",
        "Limited material presets",
        "Limited environment presets"
      ],
      limitations: [
        "Public sharing (watermark ON)",
        "No collaboration",
        "No AR",
        "No AI"
      ]
    },
    {
      name: "Baap+",
      description: "For designers, freelancers, small creators",
      price: { monthly: 24, annual: 20 },
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "Unlimited Projects",
        "5 GB storage",
        "HQ Cloud Rendering (RunPod/AWS)",
        "Real-time collaboration (2 seats)",
        "Advanced import pipeline",
        "Basic version history",
        "Presentation mode",
        "Mobile AR Viewer",
        "Advanced rendering (SSAO, SSR, DOF)",
        "Full environment library",
        "No watermark",
        "20 AI credits/month"
      ],
      limitations: []
    },
    {
      name: "Dada",
      description: "For studios & architecture firms",
      price: { monthly: 65, annual: 54 },
      icon: Trophy,
      color: "from-blue-500 to-cyan-400",
      popular: false,
      features: [
        "Everything in Baap+",
        "5 Team members",
        "Team workspaces",
        "20 GB storage",
        "Team asset library",
        "Analytics dashboard",
        "Carbon footprint report",
        "Performance report",
        "Advanced version control (branches)",
        "Admin controls",
        "Audit logs",
        "Custom roles & permissions",
        "Private sharing"
      ],
      limitations: []
    },
    {
      name: "Bhagwaan",
      description: "For large studios & corporates",
      price: { monthly: "Custom", annual: "Custom" },
      icon: Gem,
      color: "from-orange-400 to-pink-500",
      popular: false,
      features: [
        "Everything in Dada +",
        "Unlimited storage",
        "Unlimited users",
        "SSO / SAML",
        "White-label domain",
        "API access",
        "Custom workflows",
        "On-prem deployment (optional)",
        "Dedicated GPU nodes (AWS/GCP/Azure/NVIDIA)",
        "Priority GPU queue",
        "Advanced security",
        "SLA guarantee",
        "Dedicated account manager"
      ],
      limitations: []
    }
  ]

  const faqCategories = [
    {
      title: "Account & Billing",
      faqs: [
        {
          question: "Can I upgrade or downgrade my plan anytime?",
          answer: "Yes. Upgrades apply immediately. Downgrades take effect at the end of the current billing cycle."
        },
        {
          question: "What happens to my projects if I downgrade?",
          answer: "Your projects remain safe. However: Premium rendering becomes disabled, Collaboration tools become read-only, Version History access is limited, Storage limits must be reduced to match the new plan. No project is deleted automatically."
        },
        {
          question: "Do you offer refunds?",
          answer: "We provide a 14-day money-back guarantee on annual plans. Monthly subscriptions are non-refundable because GPU rendering consumes non-recoverable computing resources."
        },
        {
          question: "What payment methods do you accept?",
          answer: "All major credit & debit cards, PayPal, Corporate invoices (Enterprise), Bank transfer (Enterprise), UPI / Wallets (coming soon)."
        }
      ]
    },
    {
      title: "Product & Features",
      faqs: [
        {
          question: "Can I use TEELI offline?",
          answer: "TEELI is fully cloud-based and requires an internet connection. However, paid users will be able to export a standalone offline viewer and download rendered images & assets. Offline editing is not supported."
        },
        {
          question: "Which 3D file formats does TEELI support?",
          answer: "Currently supported: GLB/GLTF, FBX. Coming soon: OBJ, USDZ."
        },
        {
          question: "Does TEELI provide cloud GPU rendering?",
          answer: "Yes. High-quality renders run on cloud GPUs (AWS/GCP/Azure/RunPod). No local GPU is required."
        },
        {
          question: "Can multiple users work on the same 3D scene?",
          answer: "Yes. Real-time collaboration includes: Live cursors, Camera sync, Real-time comments & annotations."
        }
      ]
    },
    {
      title: "Rendering & Performance",
      faqs: [
        {
          question: "How long do cloud renders take?",
          answer: "Usually: Preview Render: 2–10 seconds, High-Quality Render: 10–60 seconds. Depends on polycount, materials, and lighting settings."
        },
        {
          question: "Which cloud GPUs do you use?",
          answer: "Depending on region & load: NVIDIA A10G, NVIDIA A100, NVIDIA 4090, NVIDIA L40/H100 (Enterprise)."
        },
        {
          question: "Is ray tracing supported?",
          answer: "Yes. High-quality rendering uses cloud GPUs with Cycles-style lighting for photorealistic results."
        }
      ]
    },
    {
      title: "Enterprise & Security",
      faqs: [
        {
          question: "How secure is my data?",
          answer: "Encrypted at rest (AES-256), Encrypted in transit (TLS 1.2+), Role-based access, Private file storage via signed URLs, Optional SSO for enterprise."
        },
        {
          question: "Do you provide white-labeling?",
          answer: "Yes. Enterprise plans support: Custom domain, Custom logo, Custom viewer theme."
        },
        {
          question: "Do you support on-premise deployment?",
          answer: "Yes. For large organizations with strict security requirements."
        }
      ]
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
              Simple Pricing
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12">
            Start free, scale as you grow. No hidden fees, no surprises.
            <br className="hidden sm:block" />
            <span className="text-purple-300">Cancel anytime.</span>
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-zinc-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-zinc-400'}`}>
              Annual
              <span className="ml-2 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const price = typeof plan.price.monthly === 'number' 
                ? (isAnnual ? plan.price.annual : plan.price.monthly)
                : plan.price.monthly
              
              return (
                <div
                  key={index}
                  className={`relative overflow-visible rounded-3xl border p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                    plan.popular
                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent scale-105'
                      : 'border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-black/50 hover:border-zinc-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                      <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full text-white text-sm font-medium shadow-lg">
                        <Star className="size-4" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`size-20 rounded-3xl bg-gradient-to-br ${plan.color} p-5 mx-auto mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                      <Icon className="size-10 text-white drop-shadow-sm" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      {typeof price === 'number' ? (
                        <>
                          <span className="text-4xl font-bold text-white">${price}</span>
                          <span className="text-zinc-400">/{isAnnual ? 'year' : 'month'}</span>
                          {isAnnual && typeof plan.price.monthly === 'number' && typeof plan.price.annual === 'number' && plan.price.monthly !== 0 && (
                            <div className="text-sm text-green-400 mt-1">
                              Save ${(plan.price.monthly * 12) - (plan.price.annual * 12)}/year
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-white">{price}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <Check className="size-4 text-green-400 flex-shrink-0" />
                        <span className="text-zinc-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm opacity-60">
                        <div className="size-4 border border-zinc-600 rounded flex-shrink-0" />
                        <span className="text-zinc-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700' 
                        : plan.name === 'Beta'
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {plan.name === 'Beta' ? 'Get Started' : 
                     plan.name === 'Bhagwaan' ? 'Contact Sales' : 
                     'Start Free Trial'}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="size-2 bg-purple-500 rounded-full" />
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <div key={index} className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900/30 hover:bg-zinc-800/30 transition-colors">
                      <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                      <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
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
                Join thousands of creators who've transformed their 3D workflow with TEELI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 text-lg px-8 py-6">
                    Start Free Forever
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white gap-2 text-lg px-8 py-6">
                    View All Features
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