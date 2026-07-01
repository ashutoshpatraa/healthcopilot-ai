import { FormEvent, useState } from 'react'

import { sendSymptoms } from '../services/api'
import type { PredictionResult } from '../types'

const defaultResult: PredictionResult = { disease: 'Waiting for input', confidence: 0, risk_score: 0, specialist: 'General Physician' }

export function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState('fever, cough')
  const [result, setResult] = useState<PredictionResult>(defaultResult)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsedSymptoms = symptoms.split(',').map((item) => item.trim()).filter(Boolean)
    const response = await sendSymptoms(parsedSymptoms)
    setResult(response)
  }

  return (
    <section className="panel">
      <span className="eyebrow">Symptom checker</span>
      <h2>Model-backed triage</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Symptoms
          <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} rows={4} />
        </label>
        <button className="primary-button" type="submit">Run prediction</button>
      </form>
      <div className="result-card">
        <strong>{result.disease}</strong>
        <p>Confidence: {Math.round(result.confidence * 100)}%</p>
        <p>Risk score: {Math.round(result.risk_score * 100)}%</p>
        <p>Suggested specialist: {result.specialist}</p>
      </div>
    </section>
  )
}
