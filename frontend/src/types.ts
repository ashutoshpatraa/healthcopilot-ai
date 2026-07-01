export type DashboardSummary = {
  total_predictions: number
  total_reports: number
  total_notifications: number
  risk_trend: number[]
}

export type PredictionResult = {
  disease: string
  confidence: number
  risk_score: number
  specialist: string
}
