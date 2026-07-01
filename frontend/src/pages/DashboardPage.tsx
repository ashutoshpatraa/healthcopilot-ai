import { useEffect, useState } from 'react'

import { StatCard } from '../components/StatCard'
import { fetchDashboard } from '../services/api'
import type { DashboardSummary } from '../types'

const fallback: DashboardSummary = { total_predictions: 0, total_reports: 0, total_notifications: 0, risk_trend: [] }

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(fallback)

  useEffect(() => {
    fetchDashboard().then(setSummary).catch(() => setSummary(fallback))
  }, [])

  return (
    <section>
      <div className="section-header">
        <div>
          <span className="eyebrow">Clinical dashboard</span>
          <h2>Live operational metrics</h2>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard label="Predictions" value={String(summary.total_predictions)} hint="Recent symptom-to-disease inferences" />
        <StatCard label="Reports" value={String(summary.total_reports)} hint="OCR and summary pipeline output" />
        <StatCard label="Notifications" value={String(summary.total_notifications)} hint="Clinical follow-up and reminders" />
      </div>
      <div className="panel">
        <h3>Risk trend</h3>
        <div className="trend-row">
          {summary.risk_trend.length === 0 ? <p>No risk events yet.</p> : summary.risk_trend.map((value, index) => <span key={`${value}-${index}`}>{value.toFixed(2)}</span>)}
        </div>
      </div>
    </section>
  )
}
