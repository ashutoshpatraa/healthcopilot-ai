import Layout from '../components/Layout';

export default function Analytics() {
  return (
    <Layout>
      <div className="mb-12">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-4 uppercase">Analytics Overview</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Real-time clinical data aggregation and predictive modeling metrics. All parameters nominal.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
        <div className="bg-surface p-6 brutalist-border ai-border-left flex flex-col justify-between h-40">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Scans Processed</span>
          <div className="font-headline-xl text-headline-xl text-primary">1,240</div>
        </div>
        <div className="bg-surface p-6 brutalist-border flex flex-col justify-between h-40">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Active AI Consults</span>
          <div className="font-headline-xl text-headline-xl text-primary text-[#FF4D4D]">34</div>
        </div>
        <div className="bg-surface p-6 brutalist-border flex flex-col justify-between h-40">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Risk Mitigation Rate</span>
          <div className="font-headline-xl text-headline-xl text-primary text-[#00C853]">88%</div>
        </div>
        <div className="bg-surface p-6 brutalist-border flex flex-col justify-between h-40">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">System Latency</span>
          <div className="font-headline-xl text-headline-xl text-primary text-[#FFD500]">12ms</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-12">
        {/* Large Chart Span */}
        <div className="lg:col-span-2 bg-surface brutalist-border p-6 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-primary uppercase">Disease Trends</h2>
            <span className="font-data-mono text-data-mono bg-surface-variant px-2 py-1 brutalist-border border-b-2 border-r-2 text-xs">YTD 2024</span>
          </div>
          {/* Mock Chart Area */}
          <div className="flex-1 relative border-l-4 border-b-4 border-primary">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="w-full h-px bg-primary opacity-10"></div>
              <div className="w-full h-px bg-primary opacity-10"></div>
              <div className="w-full h-px bg-primary opacity-10"></div>
              <div className="w-full h-px bg-primary opacity-10"></div>
              <div className="w-full h-px bg-primary opacity-10"></div>
            </div>
            {/* Mock Lines */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path d="M0,80 L20,75 L40,60 L60,85 L80,40 L100,30 L120,50 L140,20 L160,10" fill="none" stroke="#00E5FF" strokeWidth="4" vectorEffect="non-scaling-stroke"></path>
              <path d="M0,90 L20,85 L40,95 L60,70 L80,75 L100,60 L120,80 L140,50 L160,40" fill="none" stroke="#FF4D4D" strokeWidth="4" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
          <div className="flex justify-between mt-2 font-data-mono text-data-mono text-xs text-on-surface-variant">
            <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
          </div>
        </div>

        {/* Secondary Metric */}
        <div className="bg-surface brutalist-border ai-border-left p-6 h-96 flex flex-col">
          <h2 className="font-headline-md text-headline-md text-primary uppercase mb-6">Symptom Frequency</h2>
          <div className="flex-1 flex flex-col justify-end gap-4">
            <div className="flex items-center gap-4">
              <span className="font-data-mono text-data-mono w-16">Fever</span>
              <div className="flex-1 h-6 border-2 border-primary bg-surface overflow-hidden">
                <div className="h-full hatch-bg" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-data-mono text-data-mono w-16">Cough</span>
              <div className="flex-1 h-6 border-2 border-primary bg-surface overflow-hidden">
                <div className="h-full hatch-bg" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-data-mono text-data-mono w-16">Fatigue</span>
              <div className="flex-1 h-6 border-2 border-primary bg-surface overflow-hidden">
                <div className="h-full hatch-bg" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-data-mono text-data-mono w-16">Pain</span>
              <div className="flex-1 h-6 border-2 border-primary bg-surface overflow-hidden">
                <div className="h-full hatch-bg" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12">
        <div className="bg-surface p-6 brutalist-border">
          <h2 className="font-headline-md text-headline-md text-primary uppercase mb-4">Health Score Timeline</h2>
          <div className="h-48 relative border-l-4 border-b-4 border-primary flex items-end justify-between px-2 pt-4">
            {/* Bar Chart Mock */}
            <div className="w-8 bg-[#00C853] h-[80%] border-2 border-primary"></div>
            <div className="w-8 bg-[#00C853] h-[75%] border-2 border-primary"></div>
            <div className="w-8 bg-[#FFD500] h-[60%] border-2 border-primary"></div>
            <div className="w-8 bg-[#FF4D4D] h-[40%] border-2 border-primary"></div>
            <div className="w-8 bg-[#FFD500] h-[55%] border-2 border-primary"></div>
            <div className="w-8 bg-[#00C853] h-[85%] border-2 border-primary"></div>
            <div className="w-8 bg-[#00E5FF] h-[95%] border-2 border-primary"></div>
          </div>
        </div>

        <div className="bg-surface p-6 brutalist-border flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
          <h3 className="font-headline-md text-headline-md text-primary uppercase mb-2">Generate Report</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Compile current analytic models into PDF format.</p>
          <button className="bg-primary text-white font-label-caps text-label-caps py-3 px-8 border-4 border-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_#00E5FF] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all">
            COMPILE DATA
          </button>
        </div>
      </div>
    </Layout>
  );
}
