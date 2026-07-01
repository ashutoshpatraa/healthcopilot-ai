import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children, mainClassName }: { children: React.ReactNode, mainClassName?: string }) {
  const location = useLocation();
  const path = location.pathname;

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
              <Link to="/dashboard" className={`flex items-center gap-3 p-3 block transition-all duration-75 ${path === '/dashboard' ? 'bg-secondary-container text-on-secondary-container border-4 border-primary translate-x-[-6px] translate-y-[-6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'text-primary border-2 border-transparent hover:bg-secondary-container brutalist-border'}`}>
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/symptom-checker" className={`flex items-center gap-3 p-3 block transition-all duration-75 ${path === '/symptom-checker' ? 'bg-secondary-container text-on-secondary-container border-4 border-primary translate-x-[-6px] translate-y-[-6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'text-primary border-2 border-transparent hover:bg-secondary-container brutalist-border'}`}>
                <span className="material-symbols-outlined">medical_services</span>
                Symptom Checker
              </Link>
            </li>
            <li>
              <Link to="/reports" className={`flex items-center gap-3 p-3 block transition-all duration-75 ${path === '/reports' ? 'bg-secondary-container text-on-secondary-container border-4 border-primary translate-x-[-6px] translate-y-[-6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'text-primary border-2 border-transparent hover:bg-secondary-container brutalist-border'}`}>
                <span className="material-symbols-outlined">folder_shared</span>
                Medical Records
              </Link>
            </li>
            <li>
              <Link to="/ai-consult" className={`flex items-center gap-3 p-3 block transition-all duration-75 ${path === '/ai-consult' ? 'bg-secondary-container text-on-secondary-container border-4 border-primary translate-x-[-6px] translate-y-[-6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'text-primary border-2 border-transparent hover:bg-secondary-container brutalist-border'}`}>
                <span className="material-symbols-outlined">smart_toy</span>
                AI Consult
              </Link>
            </li>
            <li>
              <Link to="/analytics" className={`flex items-center gap-3 p-3 block transition-all duration-75 ${path === '/analytics' ? 'bg-secondary-container text-on-secondary-container border-4 border-primary translate-x-[-6px] translate-y-[-6px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'text-primary border-2 border-transparent hover:bg-secondary-container brutalist-border'}`}>
                <span className="material-symbols-outlined">monitoring</span>
                Analytics
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
      <main className={mainClassName || "flex-1 w-full md:ml-64 mt-20 md:mt-0 p-container-margin md:p-12 overflow-y-auto"}>
        {children}
      </main>

      {/* Footer Mobile (Visible md:hidden) */}
      <footer className="md:hidden w-full border-t-4 border-primary bg-primary text-white font-data-mono text-data-mono py-container-margin px-container-margin flex flex-col items-center gap-gutter text-center mt-auto">
        <div className="font-headline-lg-mobile text-headline-lg-mobile">HealthCopilot AI</div>
        <p className="text-xs">© 2024 HEALTHCOPILOT AI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
