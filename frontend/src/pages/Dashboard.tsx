import Layout from '../components/Layout';
import { Card } from '../components/ui/Card';

export default function Dashboard() {
  return (
    <Layout>
      <div className="mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-4 uppercase">HELLO, PATIENT_092.<br/>SYSTEM ACTIVE.</h2>
        <div className="w-full h-1 bg-primary brutalist-border"></div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid-12">
          {/* Health Summary (Span 8) */}
          <Card className="col-span-12 md:col-span-8 relative">
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
          </Card>

          {/* Risk Score (Span 4) */}
          <Card className="col-span-12 md:col-span-4 flex flex-col justify-between">
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
          </Card>

          {/* Quick Actions (Span 12) */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
            <Card interactive className="flex flex-col items-center justify-center gap-4 group !p-6">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">qr_code_scanner</span>
              <span className="font-label-caps text-label-caps uppercase text-center">New Scan</span>
            </Card>
            <Card interactive accentColor="cyan" className="flex flex-col items-center justify-center gap-4 group !p-6">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">smart_toy</span>
              <span className="font-label-caps text-label-caps uppercase text-center">Chat AI</span>
            </Card>
            <Card interactive className="flex flex-col items-center justify-center gap-4 group !p-6">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">folder_open</span>
              <span className="font-label-caps text-label-caps uppercase text-center">View Records</span>
            </Card>
            <Card interactive className="flex flex-col items-center justify-center gap-4 group !p-6">
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">calendar_month</span>
              <span className="font-label-caps text-label-caps uppercase text-center">Schedule</span>
            </Card>
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
          <Card className="col-span-12 md:col-span-5">
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
          </Card>
        </div>
    </Layout>
  );
}
