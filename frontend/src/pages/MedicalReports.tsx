import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/Button';
import { useToast, Toast } from '../components/ui/Toast';

interface UploadResult {
  summary: string;
  extracted_text: string;
  method: string;
}

export default function MedicalReports() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadStatus('Uploading...');
      setIsUploading(true);
      setResult(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/v1/upload/`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        setResult(data);
        setUploadStatus('Extraction complete');
        showToast('Extraction complete', 'success');
      } catch (err) {
        console.error(err);
        setUploadStatus('Error uploading file');
        showToast('Error uploading file', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  }, [showToast]);

  return (
    <Layout mainClassName="flex-1 w-full md:ml-64 mt-20 md:mt-0 min-h-screen flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
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
            disabled={isUploading}
            className={`absolute inset-0 w-full h-full opacity-0 z-10 ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`} 
          />
          <div className={`w-full bg-surface-container-lowest border-[5px] border-primary border-dashed py-16 flex flex-col items-center justify-center gap-4 transition-all duration-150 group ${isUploading ? 'opacity-70' : 'hover:bg-secondary-container hover:border-solid hover:brutalist-shadow-cyan cursor-pointer'}`}>
            <span className={`material-symbols-outlined text-[48px] text-primary transition-transform ${isUploading ? 'animate-bounce' : 'group-hover:scale-110'}`}>{isUploading ? 'cloud_upload' : 'upload_file'}</span>
            <span className="font-headline-md text-headline-md text-primary uppercase text-center px-4">
              {isUploading ? 'Uploading...' : (file ? file.name : 'Upload New Medical Record')}
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant uppercase">
              {uploadStatus || 'Supported: PDF, JPG, PNG (Max 50MB)'}
            </span>
          </div>
        </div>

        {/* AI Summary Banner — only show after upload */}
        {result && (
          <div className="col-span-4 md:col-span-12 bg-secondary-container border-border-width border-primary p-gutter relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[32px] text-primary mt-1">auto_awesome</span>
              <div>
                <h3 className="font-headline-md text-headline-md text-primary uppercase mb-2">AI Extraction Summary</h3>
                <p className="font-body-lg text-body-lg text-primary mb-4">{result.summary}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-primary text-secondary-container px-2 py-1 font-data-mono text-data-mono uppercase border-2 border-primary">Method: {result.method}</span>
                  <span className="bg-surface text-primary px-2 py-1 font-data-mono text-data-mono uppercase border-2 border-primary">Source: {file?.name || 'upload'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Data / OCR Viewer — only show after upload */}
        {result && (
          <div className="col-span-4 md:col-span-12 grid grid-cols-1 md:grid-cols-1 gap-gutter mt-4">
            {/* OCR Text Output */}
            <div className="bg-surface-container-lowest border-border-width border-primary flex flex-col h-[600px] border-l-[8px] border-l-secondary-container">
              <div className="bg-primary text-white px-4 py-2 border-b-border-width border-primary flex justify-between items-center">
                <span className="font-data-mono text-data-mono uppercase">Extracted Data (OCR text)</span>
                <div className="flex gap-2">
                  <Button variant="ghost" aria-label="Copy Data" className="!p-1 text-secondary-container hover:text-white border-none shadow-none" onClick={() => { navigator.clipboard.writeText(result.extracted_text); showToast('Copied to clipboard', 'success'); }}>
                    <span className="material-symbols-outlined text-[20px]" aria-hidden="true">content_copy</span>
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-4 bg-surface-container-lowest overflow-y-auto">
                <pre className="font-data-mono text-data-mono text-on-surface whitespace-pre-wrap leading-relaxed">
{result.extracted_text}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no upload has been done */}
        {!result && !isUploading && (
          <div className="col-span-4 md:col-span-12 mt-8 flex flex-col items-center justify-center py-16">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30 mb-4">description</span>
            <p className="font-headline-md text-headline-md text-on-surface-variant uppercase">No documents uploaded yet</p>
            <p className="font-data-mono text-data-mono text-on-surface-variant mt-2">Upload a PDF, JPG, or PNG to begin OCR extraction</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

