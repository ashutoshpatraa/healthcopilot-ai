import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="font-body-md text-body-md overflow-x-hidden flex h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-surface">
      {/* Mobile TopNavBar (Visible md:hidden) */}
      <header className="md:hidden w-full border-b-4 border-primary bg-surface flex justify-between items-center px-container-margin py-base max-w-full fixed top-0 z-50">
        <div className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">HealthCopilot AI</div>
        <div className="flex gap-4 text-primary">
          <span className="material-symbols-outlined hover:bg-secondary-container transition-colors duration-100 p-2 brutalist-border cursor-pointer">notifications</span>
          <span className="material-symbols-outlined hover:bg-secondary-container transition-colors duration-100 p-2 brutalist-border cursor-pointer">emergency</span>
          <span className="material-symbols-outlined hover:bg-secondary-container transition-colors duration-100 p-2 brutalist-border cursor-pointer">account_circle</span>
        </div>
      </header>

      {/* SideNavBar (Hidden md:flex) */}
      <nav className="hidden md:flex flex-col bg-surface fixed left-0 top-0 h-full w-64 border-r-4 border-primary p-base z-40 justify-between">
        <div>
          <div className="mb-8 p-4">
            <h1 className="font-headline-md text-headline-md font-bold text-primary mb-2">HealthCopilot AI</h1>
            <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container inline-block border-2 border-primary"></span>
              Clinical AI Active
            </div>
          </div>
          <ul className="flex flex-col gap-4 font-label-caps text-label-caps uppercase">
            <li>
              <Link to="/dashboard" className="flex items-center gap-3 p-3 bg-secondary-container text-on-secondary-container border-4 border-primary translate-x-[-6px] translate-y-[-6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-75 block">
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">medical_services</span>
                Symptom Checker
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">folder_shared</span>
                Medical Records
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">smart_toy</span>
                AI Consult
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">monitoring</span>
                Analytics
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">settings</span>
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 mt-auto font-label-caps text-label-caps uppercase pt-8">
          <button className="w-full bg-[#FF4D4D] text-white brutalist-border p-3 brutalist-shadow active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-bold">
            EMERGENCY PROTOCOL
          </button>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="#" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">help_center</span>
                Support
              </Link>
            </li>
            <li>
              <Link to="/auth" className="flex items-center gap-3 p-3 text-primary border-2 border-transparent hover:bg-secondary-container transition-all duration-75 block brutalist-border">
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64 mt-20 md:mt-0 p-container-margin md:p-12 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="font-headline-xl text-headline-xl text-primary mb-4 uppercase">HELLO, PATIENT_092.<br/>SYSTEM ACTIVE.</h2>
          <div className="w-full h-1 bg-primary brutalist-border"></div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid-12">
          {/* Health Summary (Span 8) */}
          <div className="col-span-12 md:col-span-8 bg-surface-container-lowest brutalist-border p-6 relative">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-secondary-container"></div>
            <h3 className="font-headline-md text-headline-md mb-6 uppercase">Health Summary</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Gauge */}
              <div className="w-48 h-48 rounded-full brutalist-border flex items-center justify-center relative bg-surface">
                <div className="absolute inset-0 rounded-full border-[16px] border-primary" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 50%)" }}></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-secondary-container" style={{ clipPath: "polygon(0 50%, 100% 100%, 0 100%)" }}></div>
                <div className="text-center">
                  <span className="font-headline-lg text-headline-lg block leading-none">94%</span>
                  <span className="font-label-caps text-label-caps block mt-2">SCORE</span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-4 font-data-mono text-data-mono">
                <div className="flex justify-between items-center border-b-4 border-primary pb-2">
                  <span>Vitals</span>
                  <span className="bg-[#00E5FF] px-2 py-1 brutalist-border">STABLE</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-primary pb-2">
                  <span>Recent Labs</span>
                  <span className="bg-[#00E5FF] px-2 py-1 brutalist-border">NOMINAL</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-primary pb-2">
                  <span>AI Analysis</span>
                  <span className="bg-[#00E5FF] px-2 py-1 brutalist-border">OPTIMAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score (Span 4) */}
          <div className="col-span-12 md:col-span-4 bg-surface-container-lowest brutalist-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md mb-2 uppercase">Risk Score</h3>
              <p className="font-data-mono text-data-mono text-on-surface-variant mb-6">Predictive AI Assessment</p>
            </div>
            <div className="bg-surface p-4 brutalist-border text-center border-l-[8px] border-l-[#FF4D4D]">
              <span className="font-label-caps text-label-caps block mb-2 text-[#FF4D4D]">Cardiac Risk</span>
              <span className="font-headline-lg text-headline-lg block">LOW</span>
            </div>
            <div className="mt-6 w-full bg-surface brutalist-border h-8 relative overflow-hidden">
              <div className="h-full w-[15%] hatch-bg brutalist-border border-l-0 border-t-0 border-b-0"></div>
            </div>
          </div>

          {/* Quick Actions (Span 12) */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
            <button className="bg-surface-container-lowest brutalist-border p-6 brutalist-shadow hover:brutalist-shadow-cyan active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex flex-col items-center justify-center gap-4 group">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors">qr_code_scanner</span>
              <span className="font-label-caps text-label-caps uppercase text-center">New Scan</span>
            </button>
            <button className="bg-surface-container-lowest brutalist-border p-6 brutalist-shadow hover:brutalist-shadow-cyan active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex flex-col items-center justify-center gap-4 group border-l-[8px] border-l-[#00E5FF]">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors">smart_toy</span>
              <span className="font-label-caps text-label-caps uppercase text-center">Chat AI</span>
            </button>
            <button className="bg-surface-container-lowest brutalist-border p-6 brutalist-shadow hover:brutalist-shadow-cyan active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex flex-col items-center justify-center gap-4 group">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors">folder_open</span>
              <span className="font-label-caps text-label-caps uppercase text-center">View Records</span>
            </button>
            <button className="bg-surface-container-lowest brutalist-border p-6 brutalist-shadow hover:brutalist-shadow-cyan active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex flex-col items-center justify-center gap-4 group">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors">calendar_month</span>
              <span className="font-label-caps text-label-caps uppercase text-center">Schedule</span>
            </button>
          </div>

          {/* Recent Diagnoses Table (Span 7) */}
          <div className="col-span-12 md:col-span-7 bg-surface-container-lowest brutalist-border overflow-hidden flex flex-col">
            <div className="p-6 border-b-4 border-primary bg-surface flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md uppercase">Recent Activity</h3>
              <span className="material-symbols-outlined">filter_list</span>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse font-data-mono text-data-mono">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-4 border-r-4 border-primary font-bold">DATE</th>
                    <th className="p-4 border-r-4 border-primary font-bold">EVENT</th>
                    <th className="p-4 font-bold">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-4 border-primary bg-surface-container-lowest hover:bg-surface transition-colors">
                    <td className="p-4 border-r-4 border-primary">2024-10-24</td>
                    <td className="p-4 border-r-4 border-primary">AI Routine Check</td>
                    <td className="p-4"><span className="bg-[#00E5FF] px-2 py-1 text-primary brutalist-border text-xs">CLEAR</span></td>
                  </tr>
                  <tr className="border-b-4 border-primary bg-surface hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 border-r-4 border-primary">2024-09-12</td>
                    <td className="p-4 border-r-4 border-primary">Blood Panel</td>
                    <td className="p-4"><span className="bg-surface-dim px-2 py-1 text-primary brutalist-border text-xs">REVIEW</span></td>
                  </tr>
                  <tr className="border-b-4 border-primary bg-surface-container-lowest hover:bg-surface transition-colors">
                    <td className="p-4 border-r-4 border-primary">2024-08-05</td>
                    <td className="p-4 border-r-4 border-primary">Vaccination</td>
                    <td className="p-4"><span className="bg-primary text-white px-2 py-1 brutalist-border text-xs">DONE</span></td>
                  </tr>
                  <tr className="bg-surface hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 border-r-4 border-primary">2024-06-20</td>
                    <td className="p-4 border-r-4 border-primary">Consultation</td>
                    <td className="p-4"><span className="bg-primary text-white px-2 py-1 brutalist-border text-xs">DONE</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Medical History Timeline (Span 5) */}
          <div className="col-span-12 md:col-span-5 bg-surface-container-lowest brutalist-border p-6">
            <h3 className="font-headline-md text-headline-md mb-6 uppercase">Medical History</h3>
            <div className="relative pl-6 border-l-4 border-primary space-y-8 font-data-mono text-data-mono">
              {/* Timeline Node */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1 w-4 h-4 bg-[#00E5FF] brutalist-border"></div>
                <div className="mb-1 font-bold">2023 - Appendectomy</div>
                <div className="text-on-surface-variant text-sm">Procedure successful. No complications noted in post-op AI analysis.</div>
              </div>
              {/* Timeline Node */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1 w-4 h-4 bg-primary brutalist-border"></div>
                <div className="mb-1 font-bold">2021 - COVID-19 Recovery</div>
                <div className="text-on-surface-variant text-sm">Monitored vitals returned to baseline after 14 days.</div>
              </div>
              {/* Timeline Node */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1 w-4 h-4 bg-primary brutalist-border"></div>
                <div className="mb-1 font-bold">2018 - Baseline Established</div>
                <div className="text-on-surface-variant text-sm">Initial intake and comprehensive genomic sequencing completed.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mobile (Visible md:hidden) */}
      <footer className="md:hidden w-full border-t-4 border-primary bg-primary text-white font-data-mono text-data-mono py-container-margin px-container-margin flex flex-col items-center gap-gutter text-center mt-auto">
        <div className="font-headline-lg-mobile text-headline-lg-mobile">HealthCopilot AI</div>
        <p className="text-xs">© 2024 HEALTHCOPILOT AI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
