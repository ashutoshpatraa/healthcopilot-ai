import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function SymptomChecker() {
  const [description, setDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const navigate = useNavigate();

  const severeKeywords = ['chest pain', 'heart attack', 'stroke', 'bleeding', 'unconscious', 'emergency'];

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    
    const hasSevere = severeKeywords.some(keyword => text.toLowerCase().includes(keyword));
    setIsEmergency(hasSevere);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const executePrediction = async () => {
    if (!description && selectedSymptoms.length === 0) return;
    
    try {
      // Basic mock prediction call
      const res = await fetch('http://localhost:8000/api/v1/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: description })
      });
      const data = await res.json();
      alert("Prediction Output: " + JSON.stringify(data));
      // In a real app we would navigate to a result screen or update UI
    } catch(err) {
      alert("Failed to connect to backend");
    }
  };

  return (
    <Layout>
      <div className="flex-grow w-full flex flex-col gap-gutter max-w-screen-2xl">
        {/* Emergency Banner (Hidden by default, shown via state if needed) */}
        {isEmergency && (
          <div className="w-full brutalist-border flash-emergency p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <span className="font-headline-md text-headline-md font-bold uppercase tracking-widest">CRITICAL SYMPTOMS DETECTED</span>
            </div>
            <button className="bg-primary text-white font-label-caps text-label-caps px-4 py-2 brutalist-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all hover:bg-opacity-90 whitespace-nowrap">
              INITIATE EMERGENCY RESPONSE
            </button>
          </div>
        )}

        {/* Page Header */}
        <header className="flex flex-col border-b-4 border-primary pb-4 mb-4">
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tighter uppercase leading-none md:text-headline-xl text-headline-lg-mobile">
            SYMPTOM DIAGNOSTIC MODULE
          </h1>
          <p className="font-data-mono text-data-mono text-on-surface-variant mt-2 uppercase">Input patient data for AI-assisted differential diagnosis.</p>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {/* Free Text Input */}
            <div className="bg-surface p-gutter brutalist-border flex flex-col gap-4 relative">
              <div className="absolute top-0 right-0 bg-secondary-container text-primary font-label-caps text-label-caps px-3 py-1 border-l-4 border-b-4 border-primary">
                PRIMARY INPUT
              </div>
              <label className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2" htmlFor="condition-desc">
                <span className="material-symbols-outlined">edit_note</span>
                Describe your condition...
              </label>
              <textarea 
                className="w-full bg-white text-primary font-body-lg text-body-lg brutalist-border p-4 focus:outline-none focus:border-secondary-container focus:ring-0 resize-none" 
                id="condition-desc" 
                placeholder="E.g., I have been experiencing a sharp pain in my lower right abdomen for the past 48 hours..." 
                rows={5}
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
            </div>

            {/* Chips Area */}
            <div className="bg-surface p-gutter brutalist-border flex flex-col gap-4 ai-border-left">
              <label className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Quick Select Symptoms
              </label>
              <div className="flex flex-wrap gap-3">
                {['Cough', 'Fever', 'Fatigue', 'Nausea', 'Headache', 'Shortness of Breath'].map(symp => (
                  <button 
                    key={symp}
                    onClick={() => toggleSymptom(symp)}
                    className={`font-data-mono text-data-mono px-4 py-2 border-2 border-primary hover:border-primary transition-colors cursor-pointer ${selectedSymptoms.includes(symp) ? 'bg-secondary-container font-bold text-primary' : 'bg-white text-primary hover:bg-secondary-container'}`}
                  >
                    {symp}
                  </button>
                ))}
                <button className="bg-surface-variant text-on-surface-variant font-data-mono text-data-mono px-4 py-2 border-2 border-dashed border-outline hover:bg-surface-dim transition-colors cursor-pointer flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">add</span> Custom
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div onClick={() => navigate('/reports')} className="bg-surface p-gutter dashed-upload-border flex flex-col items-center justify-center gap-4 text-center min-h-[200px] hover:bg-[#FFD500]/10 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[48px] text-primary">upload_file</span>
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-primary">Upload Medical Reports</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Drag and drop lab results, imaging, or previous diagnoses (PDF, JPG, PNG)</p>
              </div>
              <button className="bg-white text-primary font-label-caps text-label-caps px-6 py-2 border-2 border-primary hover:bg-primary hover:text-white transition-colors">
                BROWSE FILES
              </button>
            </div>

            {/* Primary Action */}
            <button onClick={executePrediction} className="bg-white text-primary font-headline-lg text-headline-lg font-bold p-6 brutalist-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all w-full flex justify-between items-center group">
              <span>EXECUTE PREDICTION</span>
              <span className="material-symbols-outlined text-[40px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>

          {/* Right Column: Status & Info */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* AI Status Card */}
            <div className="bg-primary text-white p-gutter brutalist-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-4 border-b-4 border-white pb-4">
                <span className="material-symbols-outlined animate-spin">memory</span>
                <h2 className="font-headline-md text-headline-md font-bold">AI ENGINE STATUS</h2>
              </div>
              <div className="flex flex-col gap-2 font-data-mono text-data-mono">
                <div className="flex justify-between border-b border-surface-tint border-opacity-50 pb-1">
                  <span className="text-on-primary-container">Model:</span>
                  <span className="text-secondary-fixed font-bold">MED_X_7B</span>
                </div>
                <div className="flex justify-between border-b border-surface-tint border-opacity-50 pb-1">
                  <span className="text-on-primary-container">Confidence Threshold:</span>
                  <span className="text-white">85.0%</span>
                </div>
                <div className="flex justify-between border-b border-surface-tint border-opacity-50 pb-1">
                  <span className="text-on-primary-container">Data Sources:</span>
                  <span className="text-white">Active</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-on-primary-container">System Readiness:</span>
                  <span className="text-secondary-fixed bg-secondary-fixed/20 px-2 py-0.5 border border-secondary-fixed">OPTIMAL</span>
                </div>
              </div>
            </div>

            {/* Guidelines Card */}
            <div className="bg-surface p-gutter brutalist-border ai-border-left">
              <h3 className="font-headline-md text-headline-md font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">policy</span>
                Guidelines
              </h3>
              <ul className="font-body-md text-body-md text-primary list-none flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
                  <span>Provide as much detail as possible in the text area.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
                  <span>Include duration, severity, and any alleviating factors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#FF4D4D]">warning</span>
                  <span>Do not use this tool for active life-threatening emergencies. Call emergency services immediately.</span>
                </li>
              </ul>
            </div>

            {/* Visual Placeholder */}
            <div className="bg-surface brutalist-border overflow-hidden h-64 relative group">
              <div className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500 bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6H-pBfysHlyG4jALgGqrPTx86Psg3RdHMc0_sSIazjjDLfYQcjxlmva3vvv6AhcOowBq_Mq-9OXrvAn3irVo6Bii0lHQx5EcnJqK2XokPBES0T-6DbR7XkkT_xNhssHwi7SxvckdFocI1e_AMXUjjND9VtsJSJ5JlbDKCSbT5TlbaohljvUXTBsIFQjskj5TOtMb72Wm1CoWFYcMN8p8a87ClVRRwl7JpEMmflwdMgi9tbi-OQQOyIDS3FlwqAJK72oCJZobRplVs')" }}></div>
              <div className="absolute bottom-0 left-0 w-full bg-primary text-white p-2 font-data-mono text-data-mono border-t-4 border-black">
                CLINICAL_ENV_RENDER_01
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
