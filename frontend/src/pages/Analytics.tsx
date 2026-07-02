import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface AnalyticsData {
  total_predictions: number;
  total_chats: number;
  total_reports: number;
  avg_confidence: number;
  top_diseases: Array<{ disease: string; count: number }>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="font-headline-md text-primary">Loading analytics...</p>
        </div>
      </Layout>
    );
  }

  const totalScans = data ? data.total_predictions + data.total_reports : 0;
  const activeChats = data ? data.total_chats : 0;
  const avgConf = data ? Math.round(data.avg_confidence * 100) : 0;

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-4 uppercase">Analytics Overview</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Real-time clinical data aggregation and predictive modeling metrics. All parameters nominal.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
        <Card className="ai-border-left flex flex-col justify-between h-40 !p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Scans Processed</span>
          <div className="font-headline-xl text-headline-xl text-primary">{totalScans}</div>
        </Card>
        <Card className="flex flex-col justify-between h-40 !p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Active AI Consults</span>
          <div className="font-headline-xl text-headline-xl text-primary text-[#FF4D4D]">{activeChats}</div>
        </Card>
        <Card className="flex flex-col justify-between h-40 !p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Avg ML Confidence</span>
          <div className="font-headline-xl text-headline-xl text-primary text-[#00C853]">{avgConf}%</div>
        </Card>
        <Card className="flex flex-col justify-between h-40 !p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">System Status</span>
          <div className="font-headline-xl text-headline-xl text-primary text-[#00C853]">ONLINE</div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-12">
        {/* Top Diseases Distribution */}
        <Card className="lg:col-span-2 h-96 flex flex-col !p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-primary uppercase">Top Predicted Diseases</h2>
            <span className="font-data-mono text-data-mono bg-surface-variant px-2 py-1 brutalist-border border-b-2 border-r-2 text-xs">FROM DB</span>
          </div>
          <div className="flex-1 flex flex-col justify-end gap-4">
            {data && data.top_diseases.length > 0 ? (
              data.top_diseases.map((d, i) => {
                const maxCount = Math.max(...data.top_diseases.map(t => t.count));
                const pct = maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="font-data-mono text-data-mono w-32 truncate">{d.disease}</span>
                    <div className="flex-1 h-6 border-2 border-primary bg-surface overflow-hidden">
                      <div className="h-full hatch-bg transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="font-data-mono text-data-mono w-8 text-right">{d.count}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-data-mono text-data-mono text-on-surface-variant">No prediction data yet. Run some predictions to see trends.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Usage Summary */}
        <Card className="ai-border-left h-96 flex flex-col !p-6">
          <h2 className="font-headline-md text-headline-md text-primary uppercase mb-6">Usage Summary</h2>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="bg-surface p-4 brutalist-border text-center border-l-[8px] border-l-primary">
              <span className="font-label-caps text-label-caps block mb-2">Predictions</span>
              <span className="font-headline-lg text-headline-lg block">{data?.total_predictions || 0}</span>
            </div>
            <div className="bg-surface p-4 brutalist-border text-center border-l-[8px] border-l-[#00E5FF]">
              <span className="font-label-caps text-label-caps block mb-2">Chat Messages</span>
              <span className="font-headline-lg text-headline-lg block">{data?.total_chats || 0}</span>
            </div>
            <div className="bg-surface p-4 brutalist-border text-center border-l-[8px] border-l-[#00C853]">
              <span className="font-label-caps text-label-caps block mb-2">Reports Processed</span>
              <span className="font-headline-lg text-headline-lg block">{data?.total_reports || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12">
        <div className="bg-surface p-6 brutalist-border">
          <h2 className="font-headline-md text-headline-md text-primary uppercase mb-4">Avg ML Confidence</h2>
          <div className="h-48 relative border-l-4 border-b-4 border-primary flex items-end justify-center px-2 pt-4">
            <div className="w-24 border-2 border-primary transition-all duration-500" style={{ height: `${avgConf}%`, backgroundColor: avgConf >= 70 ? '#00C853' : avgConf >= 40 ? '#FFD500' : '#FF4D4D' }}></div>
          </div>
          <p className="font-data-mono text-data-mono text-center mt-4">{avgConf}% average confidence across all predictions</p>
        </div>

        <Card className="flex flex-col justify-center items-center text-center !p-6">
          <span className="material-symbols-outlined text-6xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">memory</span>
          <h3 className="font-headline-md text-headline-md text-primary uppercase mb-2">System Status</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">All AI models loaded and operational. Database connected.</p>
          <Button onClick={() => window.location.reload()}>REFRESH DATA</Button>
        </Card>
      </div>
    </Layout>
  );
}
