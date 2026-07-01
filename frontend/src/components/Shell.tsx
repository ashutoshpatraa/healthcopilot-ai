import type { ReactNode } from 'react'

import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/checker', label: 'Symptom Checker' },
  { to: '/chat', label: 'AI Assistant' },
  { to: '/profile', label: 'Profile' },
]

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark">HC</div>
          <h1>HealthCopilot AI</h1>
          <p>Clinical intelligence for triage, reports, and care coordination.</p>
        </div>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content-area">{children}</main>
    </div>
  )
}
