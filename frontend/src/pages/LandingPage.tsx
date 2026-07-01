import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <section className="hero-panel">
      <div>
        <span className="eyebrow">AI healthcare copilot</span>
        <h2>Symptom triage, report analysis, and patient intelligence in one workspace.</h2>
        <p>
          HealthCopilot AI combines predictive triage, OCR-assisted report processing, and conversational care guidance behind a
          secure, production-ready API surface.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/dashboard">Open dashboard</Link>
          <Link className="secondary-button" to="/checker">Check symptoms</Link>
        </div>
      </div>
      <div className="hero-card">
        <div className="pulse" />
        <h3>Operational posture</h3>
        <ul>
          <li>FastAPI backend</li>
          <li>PostgreSQL persistence</li>
          <li>JWT authentication ready</li>
          <li>React 19 UI shell</li>
        </ul>
      </div>
    </section>
  )
}
