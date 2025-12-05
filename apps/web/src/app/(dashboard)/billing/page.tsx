"use client";

import { motion } from "framer-motion";
import {
  Cube,
  Crown,
  Rocket,
  Star,
  Sparkle,
  Lightning,
  ArrowRight,
  Infinity,
  ShieldCheck,
  Headset,
  CloudArrowUp,
  FigmaLogo,
} from "@phosphor-icons/react";
import { useState } from "react";

// Pricing Plans Data
const pricingPlans = [
  {
    id: "free",
    name: "Starter",
    tagline: "For exploration",
    description: "Perfect for getting started with 3D",
    price: 0,
    period: "forever",
    icon: Cube,
    gradient: "from-slate-500/20 via-slate-400/10 to-slate-600/20",
    borderGlow: "slate",
    features: [
      { text: "5 Projects", icon: FigmaLogo },
      { text: "1GB Cloud Storage", icon: CloudArrowUp },
      { text: "720p Renders", icon: Sparkle },
      { text: "Basic 3D Editor", icon: Cube },
      { text: "Community Support", icon: Headset },
    ],
    cta: "Current Plan",
    popular: false,
    current: true,
  },
  {
    id: "pro",
    name: "Professional",
    tagline: "For creators",
    description: "Unlimited power for professionals",
    price: 29,
    period: "month",
    icon: Rocket,
    gradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
    borderGlow: "cyan",
    features: [
      { text: "Unlimited Projects", icon: Infinity },
      { text: "50GB Cloud Storage", icon: CloudArrowUp },
      { text: "4K HDR Renders", icon: Lightning },
      { text: "Advanced 3D Editor", icon: Cube },
      { text: "Priority Support 24/7", icon: Headset },
    ],
    cta: "Upgrade to Pro",
    popular: true,
    current: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For teams",
    description: "Advanced tools for organizations",
    price: 99,
    period: "month",
    icon: Crown,
    gradient: "from-purple-500/30 via-pink-500/20 to-purple-600/30",
    borderGlow: "purple",
    features: [
      { text: "Everything in Pro", icon: Star },
      { text: "500GB Cloud Storage", icon: CloudArrowUp },
      { text: "8K Cinematic Renders", icon: Sparkle },
      { text: "Unlimited Render Credits", icon: Infinity },
      { text: "Dedicated Account Manager", icon: Headset },
    ],
    cta: "Contact Sales",
    popular: false,
    current: false,
  },
];

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="w-full h-full flex flex-col px-4 sm:px-6 md:pl-12 md:pr-6 lg:px-10 xl:px-12 pt-20 sm:pt-20 md:pt-36 lg:pt-24 xl:pt-4 2xl:pt-4 pb-4 sm:pb-5 md:pb-6 2xl:pb-2 overflow-y-auto xl:overflow-hidden overflow-x-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-[1400px] mx-auto md:ml-4 lg:mx-auto w-full flex flex-col xl:justify-start xl:h-full">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-3 sm:mb-4 md:mb-5 xl:mb-2"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 dark:border-white/8 backdrop-blur-xl">
            <Sparkle size={13} weight="fill" className="text-cyan-500 dark:text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
              PLANS & BILLING
            </span>
          </div>
        </motion.div>

        {/* Billing Toggle - Centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-4 sm:mb-5 md:mb-6"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 backdrop-blur-xl shadow-sm dark:shadow-none">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-white text-slate-900 shadow-md dark:shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white dark:bg-white text-slate-900 shadow-md dark:shadow-lg"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Yearly
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-[8px] sm:text-[9px] font-bold text-white shadow-sm">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards - 2 columns on tablets & iPad Pro portrait, 3 columns on xl+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            const displayPrice = billingCycle === "yearly" && plan.price > 0 
              ? Math.round(plan.price * 0.8) 
              : plan.price;
            
            return (
              <motion.div
                key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              className="relative group"
            >
              {/* Popular Badge - Compact */}
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full blur-lg opacity-50 dark:opacity-50" />
                    <div className="relative px-3 py-0.5 rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-[10px] font-bold shadow-xl flex items-center gap-1">
                      <Star size={10} weight="fill" />
                      POPULAR
                    </div>
                  </motion.div>
                </div>
              )}
                
              {/* Main Card - Enhanced Glassmorphism with Rounded Corners */}
              <div className="relative h-full rounded-2xl sm:rounded-3xl overflow-hidden group-hover:scale-[1.01] transition-transform duration-300 shadow-xl dark:shadow-none">
                  {/* Layered Glass Effect - Light/Dark Mode */}
                  <div className={`absolute inset-0 ${
                    plan.popular
                      ? "bg-linear-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-cyan-500/30 dark:via-blue-500/20 dark:to-indigo-500/30"
                      : plan.id === "enterprise"
                        ? "bg-linear-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-purple-500/30 dark:via-pink-500/20 dark:to-purple-600/30"
                        : "bg-linear-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-500/20 dark:via-slate-400/10 dark:to-slate-600/20"
                  } backdrop-blur-2xl`} />
                  <div className="absolute inset-0 bg-linear-to-br from-white/60 via-white/40 to-transparent dark:from-white/8 dark:via-transparent dark:to-transparent" />
                  
                  {/* Border with Glow */}
                  <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl border ${
                    plan.popular 
                      ? "border-cyan-300 dark:border-cyan-500/40 shadow-lg dark:shadow-none" 
                      : "border-slate-200 dark:border-white/8 group-hover:border-slate-300 dark:group-hover:border-white/12"
                  } transition-all duration-300`} />
                  
                  {/* Ambient Glow Effect - Dark Mode Only */}
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 bg-cyan-400/20 dark:bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />
                  )}

                  {/* Card Content - Balanced Spacing */}
                  <div className="relative p-4 sm:p-5 md:p-5 lg:p-6 flex flex-col h-full">
                    {/* Header - Balanced with Light/Dark Mode */}
                    <div className="mb-3 sm:mb-4 md:mb-4 lg:mb-5">
                      <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl ${
                          plan.popular
                            ? "bg-linear-to-br from-cyan-400 to-blue-500 dark:from-cyan-500/40 dark:to-blue-500/40 border-cyan-300 dark:border-cyan-500/40"
                            : plan.id === "enterprise"
                              ? "bg-linear-to-br from-purple-400 to-pink-500 dark:from-purple-500/40 dark:to-pink-500/40 border-purple-300 dark:border-purple-500/30"
                              : "bg-linear-to-br from-slate-300 to-slate-400 dark:from-slate-500/40 dark:to-slate-600/40 border-slate-300 dark:border-white/10"
                        } border flex items-center justify-center backdrop-blur-xl shadow-lg`}>
                          <Icon size={18} className="sm:hidden text-white" weight="duotone" />
                          <Icon size={20} className="hidden sm:block md:hidden text-white" weight="duotone" />
                          <Icon size={22} className="hidden md:block text-white" weight="duotone" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {plan.name}
                          </h3>
                          <p className="text-[9px] sm:text-[10px] font-medium text-slate-600 dark:text-slate-400 tracking-wider uppercase">
                            {plan.tagline}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price - Enhanced with Light/Dark Mode */}
                    <div className="mb-3 sm:mb-4 md:mb-4 lg:mb-5 pb-3 sm:pb-4 md:pb-4 lg:pb-5 border-b border-slate-200 dark:border-white/8">
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
                          ${displayPrice}
                        </span>
                        <span className="text-[11px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400">
                          {plan.price > 0 ? `/${billingCycle === "yearly" ? "month" : plan.period}` : plan.period}
                        </span>
                      </div>
                      {billingCycle === "yearly" && plan.price > 0 && (
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 shadow-sm dark:shadow-none">
                          <Lightning size={10} className="sm:hidden text-emerald-600 dark:text-emerald-400" weight="fill" />
                          <Lightning size={11} className="hidden sm:block text-emerald-600 dark:text-emerald-400" weight="fill" />
                          <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                            Save ${(plan.price * 0.2 * 12).toFixed(0)}/year
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features - Optimized Spacing */}
                    <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4 md:mb-5 flex-1">
                      {plan.features.map((feature, i) => {
                        const FeatureIcon = feature.icon;
                        return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: 0.3 + i * 0.04 }}
                          className="flex items-center gap-2 sm:gap-2.5 group/feature"
                        >
                          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md sm:rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 flex items-center justify-center group-hover/feature:bg-slate-200 dark:group-hover/feature:bg-white/8 transition-all duration-200 shrink-0 shadow-sm dark:shadow-none">
                            <FeatureIcon size={11} className="sm:hidden text-slate-600 dark:text-white/80" weight="duotone" />
                            <FeatureIcon size={12} className="hidden sm:block md:hidden text-slate-600 dark:text-white/80" weight="duotone" />
                            <FeatureIcon size={13} className="hidden md:block text-slate-600 dark:text-white/80" weight="duotone" />
                          </div>
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-slate-700 dark:text-slate-300 group-hover/feature:text-slate-900 dark:group-hover/feature:text-white transition-colors duration-200">
                            {feature.text}
                          </span>
                        </motion.div>
                        );
                      })}
                    </div>

                    {/* CTA Button - Enhanced with Light/Dark Mode */}
                    <motion.button
                      whileHover={{ scale: plan.current ? 1 : 1.01 }}
                      whileTap={{ scale: plan.current ? 1 : 0.98 }}
                      disabled={plan.current}
                      className={`
                        relative w-full py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-bold overflow-hidden
                        transition-all duration-300 group/button
                        ${plan.current
                          ? "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-default border border-slate-200 dark:border-white/6"
                          : plan.popular
                            ? "bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-xl shadow-cyan-500/30 dark:shadow-cyan-500/20"
                            : "bg-slate-200 dark:bg-white/8 text-slate-900 dark:text-white border border-slate-300 dark:border-white/12 hover:bg-slate-300 dark:hover:bg-white/12 hover:border-slate-400 dark:hover:border-white/20 shadow-md dark:shadow-none"
                        }
                      `}
                    >
                      {!plan.current && (
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700" />
                      )}
                      <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                        {plan.cta}
                        {!plan.current && (
                          <ArrowRight 
                            size={12} 
                            className="sm:hidden"
                            weight="bold" 
                          />
                        )}
                        {!plan.current && (
                          <ArrowRight 
                            size={14} 
                            weight="bold" 
                            className="hidden sm:block group-hover/button:translate-x-0.5 transition-transform duration-200" 
                          />
                        )}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Indicators - Responsive Footer for all tablets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 sm:mt-8 md:mt-10 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-white/3 border border-slate-200 dark:border-white/6 backdrop-blur-xl shadow-lg dark:shadow-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck size={14} className="sm:hidden text-emerald-600 dark:text-emerald-400" weight="duotone" />
              <ShieldCheck size={16} className="hidden sm:block md:hidden text-emerald-600 dark:text-emerald-400" weight="duotone" />
              <ShieldCheck size={18} className="hidden md:block text-emerald-600 dark:text-emerald-400" weight="duotone" />
              <span className="text-[10px] sm:text-[11px] md:text-xs font-medium text-slate-700 dark:text-slate-400">Secure Payment</span>
            </div>
            <div className="hidden sm:block w-px h-4 md:h-5 bg-slate-300 dark:bg-white/8" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Lightning size={14} className="sm:hidden text-cyan-600 dark:text-cyan-400" weight="duotone" />
              <Lightning size={16} className="hidden sm:block md:hidden text-cyan-600 dark:text-cyan-400" weight="duotone" />
              <Lightning size={18} className="hidden md:block text-cyan-600 dark:text-cyan-400" weight="duotone" />
              <span className="text-[10px] sm:text-[11px] md:text-xs font-medium text-slate-700 dark:text-slate-400">Instant Activation</span>
            </div>
            <div className="hidden sm:block w-px h-4 md:h-5 bg-slate-300 dark:bg-white/8" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Headset size={14} className="sm:hidden text-purple-600 dark:text-purple-400" weight="duotone" />
              <Headset size={16} className="hidden sm:block md:hidden text-purple-600 dark:text-purple-400" weight="duotone" />
              <Headset size={18} className="hidden md:block text-purple-600 dark:text-purple-400" weight="duotone" />
              <span className="text-[10px] sm:text-[11px] md:text-xs font-medium text-slate-700 dark:text-slate-400">24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
