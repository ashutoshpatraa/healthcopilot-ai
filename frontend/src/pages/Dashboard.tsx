import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/ui/Card';

interface AnalyticsData {
  total_predictions: number;
  total_chats: number;
  total_reports: number;
  avg_confidence: number;
  top_diseases: Array<{ disease: string; count: number }>;
  recent_activity: Array<{ date: string; event: string; status: string }>;
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/analytics/`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    }
    fetchAnalytics();
  }, []);

  const score = data ? Math.round(data.avg_confidence * 100) : 0;
  const recent = data?.recent_activity || [];

  return (
    <Layout>
      <div className="mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-4 uppercase">HELLO, USER.<br/>SYSTEM ACTIVE.</h2>
        <div className="w-full h-1 bg-primary brutalist-border"></div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-gutter">
          {/* Health Summary (Span 8) */}
          <Card className="col-span-12 md:col-span-8 relative">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-secondary-container"></div>
            <h3 className="font-headline-md text-headline-md mb-6 uppercase">System Overview</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Gauge */}
              <div className="w-48 h-48 rounded-full brutalist-border flex items-center justify-center relative bg-surface">
                <div className="absolute inset-0 rounded-full border-[16px] border-primary" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 ${100 - score}%)` }}></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-secondary-container" style={{ clipPath: `polygon(0 ${100 - score}%, 100% 100%, 0 100%)` }}></div>
                <div className="text-center">
                  <span className="font-headline-lg text-headline-lg block leading-none">{score}%</span>
                  <span className="font-label-caps text-label-caps block mt-2">AVG CONF</span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-4 font-data-mono text-data-mono">
                <div className="flex justify-between items-center border-b-4 border-primary pb-2">
                  <span>Vitals</span>
                  <span className="bg-[#00E5FF] px-2 py-1 brutalist-border">STABLE</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-primary pb-2">
                  <span>AI API Status</span>
                  <span className="bg-[#00E5FF] px-2 py-1 brutalist-border">NOMINAL</span>
                </div>
                <div className="flex justify-between items-center border-b-4 border-primary pb-2">
                  <span>Database</span>
                  <span className="bg-[#00E5FF] px-2 py-1 brutalist-border">CONNECTED</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Risk Score (Span 4) */}
          <Card className="col-span-12 md:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md mb-2 uppercase">System Usage</h3>
              <p className="font-data-mono text-data-mono text-on-surface-variant mb-6">Total Operations</p>
            </div>
            <div className="bg-surface p-4 brutalist-border text-center border-l-[8px] border-l-primary">
              <span className="font-label-caps text-label-caps block mb-2 text-primary">Predictions</span>
              <span className="font-headline-lg text-headline-lg block">{data?.total_predictions || 0}</span>
            </div>
            <div className="bg-surface p-4 brutalist-border text-center border-l-[8px] border-l-[#00C853] mt-4">
              <span className="font-label-caps text-label-caps block mb-2 text-[#00C853]">Chat Sessions</span>
              <span className="font-headline-lg text-headline-lg block">{data?.total_chats || 0}</span>
            </div>
          </Card>

          {/* Quick Actions (Span 12) */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
            <Card interactive className="flex flex-col items-center justify-center gap-4 group !p-6" onClick={() => navigate('/scan')}>
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">qr_code_scanner</span>
              <span className="font-label-caps text-label-caps uppercase text-center">New Scan</span>
            </Card>
            <Card interactive accentColor="cyan" className="flex flex-col items-center justify-center gap-4 group !p-6" onClick={() => navigate('/chat')}>
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">smart_toy</span>
              <span className="font-label-caps text-label-caps uppercase text-center">Chat AI</span>
            </Card>
            <Card interactive className="flex flex-col items-center justify-center gap-4 group !p-6" onClick={() => navigate('/records')}>
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">folder_open</span>
              <span className="font-label-caps text-label-caps uppercase text-center">View Records</span>
            </Card>
            <Card interactive className="flex flex-col items-center justify-center gap-4 group !p-6" onClick={() => navigate('/analytics')}>
              <span className="material-symbols-outlined text-4xl group-hover:text-secondary-container transition-colors" aria-hidden="true">bar_chart</span>
              <span className="font-label-caps text-label-caps uppercase text-center">Analytics</span>
            </Card>
          </div>

          {/* Recent Diagnoses Table (Span 7) */}
          <div className="col-span-12 md:col-span-12 bg-surface-container-lowest brutalist-border overflow-hidden flex flex-col">
            <div className="p-6 border-b-4 border-primary bg-surface flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md uppercase">Recent AI Activity</h3>
              <button aria-label="Filter activity" className="material-symbols-outlined cursor-pointer hover:text-secondary-container transition-colors bg-transparent border-none p-0 text-primary dark:text-white">filter_list</button>
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
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center">No recent activity. Try making a prediction!</td>
                    </tr>
                  ) : (
                    recent.map((item, i) => (
                      <tr key={i} className="border-b-4 border-primary bg-surface-container-lowest hover:bg-surface transition-colors">
                        <td className="p-4 border-r-4 border-primary">{item.date}</td>
                        <td className="p-4 border-r-4 border-primary">{item.event}</td>
                        <td className="p-4"><span className="bg-[#00E5FF] px-2 py-1 text-primary brutalist-border text-xs">{item.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medical History Timeline (Span 5) */}
          <Card className="col-span-12 md:col-span-5">
            <h3 className="font-headline-md text-headline-md mb-6 uppercase">Medical History</h3>
            <div className="relative pl-6 border-l-4 border-primary space-y-8 font-data-mono text-data-mono">
              {recent.length === 0 ? (
                <p className="text-on-surface-variant">No history recorded yet. Use the Symptom Checker or upload reports to populate your timeline.</p>
              ) : (
                recent.slice(0, 3).map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[30px] top-1 w-4 h-4 bg-[#00E5FF] brutalist-border"></div>
                    <div className="mb-1 font-bold">{item.date} — {item.event}</div>
                    <div className="text-on-surface-variant text-sm">
                      <span className="bg-[#00E5FF] px-1 text-primary text-xs">{item.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
    </Layout>
  );
}
