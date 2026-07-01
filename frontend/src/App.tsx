import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AIConsult from './pages/AIConsult';
import MedicalReports from './pages/MedicalReports';
import SymptomChecker from './pages/SymptomChecker';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-consult" element={<AIConsult />} />
        <Route path="/reports" element={<MedicalReports />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
