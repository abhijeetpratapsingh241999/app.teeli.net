'use client'

import { ReactNode } from 'react'

interface AnalyticsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export default function AnalyticsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className = '' 
}: AnalyticsCardProps) {
  return (
    <div className={`bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-500/10 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}