import AnalyticsDashboard from '@/features/analytics/components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-zinc-400">Track your projects performance and user engagement</p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </div>
  )
}