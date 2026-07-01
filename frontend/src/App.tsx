import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

const Auth = React.lazy(() => import('./pages/Auth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AIConsult = React.lazy(() => import('./pages/AIConsult'));
const MedicalReports = React.lazy(() => import('./pages/MedicalReports'));
const SymptomChecker = React.lazy(() => import('./pages/SymptomChecker'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">
          <div className="font-headline-lg-mobile font-bold animate-pulse">LOADING_MODULE...</div>
        </div>
      }>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-consult" element={<AIConsult />} />
          <Route path="/reports" element={<MedicalReports />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
