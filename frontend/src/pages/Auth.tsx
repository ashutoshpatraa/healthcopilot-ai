import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth logic
    navigate('/dashboard'); // Will be created later
  };

  return (
    <div className="bg-background text-on-background h-screen flex font-body-md selection:bg-secondary-container selection:text-on-surface">
      {/* Left Column: Branding Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex w-24 lg:w-32 bg-primary text-white border-r-border-width border-primary flex-col justify-between items-center py-container-margin relative z-10 shrink-0">
        <div className="font-headline-md text-headline-md font-bold tracking-tighter">HC</div>
        <div className="font-headline-xl text-headline-xl vertical-text tracking-widest uppercase">
          HEALTHCOPILOT AI
        </div>
        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
      </div>

      {/* Right Column: Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-container-margin lg:p-12 relative overflow-hidden bg-surface-container-lowest">
        {/* Atmospheric Pattern (Brutalist Grid) */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ 
            backgroundImage: "linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)", 
            backgroundSize: "40px 40px" 
          }}
        ></div>

        {/* Authentication Card */}
        <div className="w-full max-w-md bg-surface-container-lowest border-border-width border-primary p-8 brutal-shadow relative z-10">
          <div className="mb-gutter text-center md:text-left">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2 uppercase border-b-border-width border-primary inline-block pb-2">
              {isLogin ? 'Authenticate' : 'Initialize'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant font-bold">HealthCopilot AI v1.0 // CLINICAL AI ACTIVE</p>
          </div>

          <form className="space-y-gutter" onSubmit={handleSubmit}>
            <Input 
              id="email" 
              type="email" 
              label="EMAIL IDENTIFIER" 
              placeholder="practitioner@med.system" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              id="password" 
              type="password" 
              label="SECURITY KEY" 
              placeholder="••••••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between mt-4">
              {isLogin && (
                <a href="#" className="font-data-mono text-data-mono font-bold underline decoration-2 hover:bg-secondary-container px-1 transition-colors">
                  Forgot Password?
                </a>
              )}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-data-mono text-data-mono font-bold underline decoration-2 hover:bg-secondary-container px-1 transition-colors bg-transparent border-none cursor-pointer"
              >
                {isLogin ? 'Create Account' : 'Authenticate Instead'}
              </button>
            </div>

            <Button type="submit" className="w-full mt-6 font-headline-md text-headline-md py-4 uppercase flex items-center justify-center gap-3">
              <span>{isLogin ? 'Authenticate' : 'Register'}</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isLogin ? 'login' : 'person_add'}
              </span>
            </Button>
          </form>

          {/* Divider */}
          <div className="my-gutter border-t-border-width border-primary relative flex justify-center">
            <span className="bg-surface-container-lowest px-4 absolute -top-3 font-label-caps text-label-caps bg-primary text-white">
              EXTERNAL IDENTITY
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="social" className="p-3 flex justify-center items-center">
              <span className="material-symbols-outlined mr-2">person</span>
              <span className="font-label-caps text-label-caps">GOOGLE</span>
            </Button>
            <Button variant="social" className="p-3 flex justify-center items-center">
              <span className="material-symbols-outlined mr-2">devices</span>
              <span className="font-label-caps text-label-caps">APPLE</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
