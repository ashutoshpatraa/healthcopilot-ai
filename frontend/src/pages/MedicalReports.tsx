import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function MedicalReports() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadStatus('Uploading...');

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const res = await fetch('http://localhost:8000/api/v1/upload', {
          method: 'POST',
          body: formData
        });
        await res.json();
        setUploadStatus('Extraction complete');
      } catch (err) {
        setUploadStatus('Error uploading file');
      }
    }
  };

  return (
    <Layout mainClassName="flex-1 w-full md:ml-64 mt-20 md:mt-0 min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-container-margin py-container-margin border-b-border-width border-primary bg-surface z-10 sticky top-0 md:top-0">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase">RECORDS ARCHIVE & OCR ANALYSIS</h1>
        <p className="font-data-mono text-data-mono text-on-surface-variant mt-2 uppercase">Secure Vault / Data Extraction Active</p>
      </header>

      {/* Content Area */}
      <div className="flex-1 p-container-margin grid grid-cols-4 md:grid-cols-12 gap-gutter auto-rows-min">
        {/* Upload Section */}
        <div className="col-span-4 md:col-span-12 relative">
          <input 
            type="file" 
            accept=".pdf,.jpg,.png" 
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <button className="w-full bg-surface-container-lowest border-[5px] border-primary border-dashed py-16 flex flex-col items-center justify-center gap-4 hover:bg-secondary-container hover:border-solid hover:shadow-[6px_6px_0px_0px_rgba(0,227,253,1)] transition-all duration-150 group">
            <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform">upload_file</span>
            <span className="font-headline-md text-headline-md text-primary uppercase text-center px-4">
              {file ? file.name : 'Upload New Medical Record'}
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant uppercase">
              {uploadStatus || 'Supported: PDF, JPG, PNG (Max 50MB)'}
            </span>
          </button>
        </div>

        {/* AI Summary Banner */}
        <div className="col-span-4 md:col-span-12 bg-secondary-container border-border-width border-primary p-gutter relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[32px] text-primary mt-1">auto_awesome</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-primary uppercase mb-2">AI Extraction Summary</h3>
              <p className="font-body-lg text-body-lg text-primary mb-4">Latest document (Lab_Results_0423.pdf) processed successfully. Detected metabolic panel data. Glucose levels indicate observation required. No critical flags triggered.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-primary text-secondary-container px-2 py-1 font-data-mono text-data-mono uppercase border-2 border-primary">Status: Validated</span>
                <span className="bg-surface text-primary px-2 py-1 font-data-mono text-data-mono uppercase border-2 border-primary">Confidence: 98.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Data / OCR Viewer */}
        <div className="col-span-4 md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-gutter mt-4">
          {/* Original Document View */}
          <div className="bg-surface-container-lowest border-border-width border-primary flex flex-col h-[600px]">
            <div className="bg-primary text-white px-4 py-2 border-b-border-width border-primary flex justify-between items-center">
              <span className="font-data-mono text-data-mono uppercase">Original Source (Image)</span>
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </div>
            <div className="flex-1 bg-surface-variant p-4 relative overflow-hidden flex items-center justify-center">
              {/* Placeholder for document image */}
              <div className="bg-cover bg-center w-full h-full border-2 border-outline-variant shadow-sm bg-surface-container-lowest" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhD7ylJKVX2e-eTy6mVikQi8kazQdOj4jFNiUkGaCR7KvDwFA6pZEVJQl_BfZPwGaNvjIwv6zs9NukaCONRlvZFKfG666d8kkHTaNyr9B9nOeG7WoXjhSYsVY7gQ1PnkR5DuDwDdjZkZcjdD8yPdD1NfpKqDqX-xAtuWnNCGhUYom_u4zA4YKuFd33u3zX7vs46sgDsE3vlT5hizhQv9GO7eYnQRON1Eehz16hEIqw5PzlhbRjdvYEyZPN9boB3HjLBKgrqQCrKt9G')" }}></div>
              {/* Overlay scanning line effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container opacity-70 blur-[1px] animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>
          </div>

          {/* OCR Text Output */}
          <div className="bg-surface-container-lowest border-border-width border-primary flex flex-col h-[600px] border-l-[8px] border-l-secondary-container">
            <div className="bg-primary text-white px-4 py-2 border-b-border-width border-primary flex justify-between items-center">
              <span className="font-data-mono text-data-mono uppercase">Extracted Data (OCR text)</span>
              <div className="flex gap-2">
                <button className="text-secondary-container hover:text-white"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
                <button className="text-secondary-container hover:text-white"><span className="material-symbols-outlined text-[20px]">download</span></button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-surface-container-lowest overflow-y-auto">
              <pre className="font-data-mono text-data-mono text-on-surface whitespace-pre-wrap leading-relaxed">
{`PATIENT ID: 8943-22-A
DATE OF SERVICE: 2023-10-24
PHYSICIAN: DR. A. MERCER

--- COMPREHENSIVE METABOLIC PANEL ---

GLUCOSE         110 mg/dL    (Ref: 70-99)   *HIGH
BUN             15 mg/dL     (Ref: 6-20) 
CREATININE      0.9 mg/dL    (Ref: 0.6-1.1)
SODIUM          140 mEq/L    (Ref: 135-145)
POTASSIUM       4.2 mEq/L    (Ref: 3.5-5.2)
CHLORIDE        102 mEq/L    (Ref: 98-108)
CO2             25 mEq/L     (Ref: 21-31)
CALCIUM         9.4 mg/dL    (Ref: 8.5-10.5)
TOTAL PROTEIN   7.2 g/dL     (Ref: 6.4-8.3)
ALBUMIN         4.5 g/dL     (Ref: 3.5-5.0)

--- LIPID PANEL ---

CHOLESTEROL     195 mg/dL    (Ref: <200)
TRIGLYCERIDES   140 mg/dL    (Ref: <150)
HDL             45 mg/dL     (Ref: >40)
LDL (CALC)      122 mg/dL    (Ref: <130)

-- END OF REPORT --`}
              </pre>
            </div>
          </div>
        </div>

        {/* Lab Values Grid */}
        <div className="col-span-4 md:col-span-12 mt-8">
          <h3 className="font-headline-md text-headline-md text-primary uppercase mb-6 border-b-border-width border-primary pb-2">Structured Lab Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {/* Metric Card 1 (Warning) */}
            <div className="bg-surface-container-lowest border-border-width border-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-error"></div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Blood Glucose</div>
              <div className="font-headline-lg text-headline-lg text-primary">110 <span className="text-body-md font-body-md text-on-surface-variant">mg/dL</span></div>
              <div className="mt-4 flex items-center justify-between">
                <span className="bg-error-container text-on-error-container border-2 border-error px-2 py-1 font-label-caps text-label-caps uppercase text-[10px]">ELEVATED</span>
                <span className="font-data-mono text-data-mono text-xs text-on-surface-variant">Ref: 70-99</span>
              </div>
            </div>
            {/* Metric Card 2 (Normal) */}
            <div className="bg-surface-container-lowest border-border-width border-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-secondary-container border-2 border-primary"></div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Creatinine</div>
              <div className="font-headline-lg text-headline-lg text-primary">0.9 <span className="text-body-md font-body-md text-on-surface-variant">mg/dL</span></div>
              <div className="mt-4 flex items-center justify-between">
                <span className="bg-surface-variant text-primary border-2 border-primary px-2 py-1 font-label-caps text-label-caps uppercase text-[10px]">NORMAL</span>
                <span className="font-data-mono text-data-mono text-xs text-on-surface-variant">Ref: 0.6-1.1</span>
              </div>
            </div>
            {/* Metric Card 3 (Normal) */}
            <div className="bg-surface-container-lowest border-border-width border-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-secondary-container border-2 border-primary"></div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Sodium</div>
              <div className="font-headline-lg text-headline-lg text-primary">140 <span className="text-body-md font-body-md text-on-surface-variant">mEq/L</span></div>
              <div className="mt-4 flex items-center justify-between">
                <span className="bg-surface-variant text-primary border-2 border-primary px-2 py-1 font-label-caps text-label-caps uppercase text-[10px]">NORMAL</span>
                <span className="font-data-mono text-data-mono text-xs text-on-surface-variant">Ref: 135-145</span>
              </div>
            </div>
            {/* Metric Card 4 (Normal) */}
            <div className="bg-surface-container-lowest border-border-width border-primary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-secondary-container border-2 border-primary"></div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Total Cholesterol</div>
              <div className="font-headline-lg text-headline-lg text-primary">195 <span className="text-body-md font-body-md text-on-surface-variant">mg/dL</span></div>
              <div className="mt-4 flex items-center justify-between">
                <span className="bg-surface-variant text-primary border-2 border-primary px-2 py-1 font-label-caps text-label-caps uppercase text-[10px]">NORMAL</span>
                <span className="font-data-mono text-data-mono text-xs text-on-surface-variant">Ref: &lt;200</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
