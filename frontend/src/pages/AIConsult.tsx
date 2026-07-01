import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/Button';

export default function AIConsult() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      text: 'Patient data loaded. I am analyzing the latest CBC panel and vitals from the past 48 hours.\n\nHow would you like to proceed with the analysis?'
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Temporary mock fetch, we'll connect this to the real backend later
      const res = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'system', text: data.response || "No response" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'system', text: "Error connecting to AI Server." }]);
    }
  };

  return (
    <Layout mainClassName="flex-1 flex flex-col md:ml-64 mt-20 md:mt-0 overflow-hidden relative bg-surface-container-low h-full">
      {/* Chat Workspace Layout */}
      <div className="flex-1 flex flex-row overflow-hidden p-base md:p-gutter gap-base md:gap-gutter">
        {/* Conversation History Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-surface border-4 border-primary p-4 shrink-0 overflow-y-auto chat-scroll">
          <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b-4 border-primary pb-2">SESSION LOG</h2>
          <div className="flex flex-col gap-4">
            <div className="p-3 border-2 border-primary bg-surface-container cursor-pointer hover:bg-secondary-container transition-colors">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">TODAY, 10:42 AM</p>
              <p className="font-body-md text-body-md font-semibold truncate">Elevated heart rate analysis</p>
            </div>
            <div className="p-3 border-2 border-primary bg-surface-container cursor-pointer hover:bg-secondary-container transition-colors">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">YESTERDAY</p>
              <p className="font-body-md text-body-md font-semibold truncate">CBC Lab Results Interpretation</p>
            </div>
            <div className="p-3 border-2 border-primary bg-surface-container cursor-pointer hover:bg-secondary-container transition-colors opacity-70">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">OCT 12</p>
              <p className="font-body-md text-body-md font-semibold truncate">Medication interaction check</p>
            </div>
          </div>
        </aside>

        {/* Active Chat Window */}
        <section className="flex-1 flex flex-col bg-surface border-4 border-primary relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* Chat Header */}
          <div className="p-4 border-b-4 border-primary bg-surface flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md m-0 leading-tight">DIAGNOSTIC AI</h3>
                <span className="font-data-mono text-data-mono text-secondary px-2 border-2 border-secondary bg-surface-container inline-block mt-1">SESSION ID: 94X-ALFA</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" aria-label="Export Log" className="!p-2 bg-surface text-primary border-4 border-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_#00E5FF] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
                <span className="material-symbols-outlined" aria-hidden="true">download</span>
              </Button>
              <Button variant="ghost" aria-label="Clear Context" className="!p-2 bg-surface text-primary border-4 border-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_#00E5FF] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
              </Button>
            </div>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 chat-scroll bg-surface-bright">
            {/* Timestamp */}
            <div className="text-center font-data-mono text-data-mono text-on-surface-variant border-b-2 border-surface-container-high w-3/4 mx-auto pb-2">
              SESSION INITIATED: 10:42:15 UTC
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col gap-1 w-full max-w-3xl ${msg.role === 'user' ? 'items-end self-end' : 'items-start'}`}>
                <span className={`font-label-caps text-label-caps text-on-surface-variant ${msg.role === 'user' ? 'mr-2' : 'ml-2'}`}>
                  {msg.role === 'user' ? 'USER / CLINICIAN' : 'DIAGNOSTIC AI'}
                </span>
                <div className={`border-4 border-primary p-4 rounded-none text-on-surface ${
                  msg.role === 'user' 
                  ? 'bg-surface text-right shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-secondary-container border-l-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                }`}>
                  <p className="font-body-lg text-body-lg whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Actions */}
          <div className="p-4 bg-surface-container border-t-4 border-primary shrink-0 overflow-x-auto whitespace-nowrap chat-scroll">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-2 inline-block w-full">SUGGESTED QUERIES:</p>
            <div className="flex gap-3">
              <Button type="button" onClick={() => setMessage('What are my risks?')} className="bg-surface text-primary font-body-md text-body-md normal-case hover:bg-secondary-container">
                What are my risks?
              </Button>
              <Button type="button" onClick={() => setMessage('Interpret my last lab')} className="bg-surface text-primary font-body-md text-body-md normal-case hover:bg-secondary-container">
                Interpret my last lab
              </Button>
              <Button type="button" onClick={() => setMessage('Check drug interactions')} className="bg-surface text-primary font-body-md text-body-md normal-case hover:bg-secondary-container">
                Check drug interactions
              </Button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-surface border-t-4 border-primary shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface border-4 border-primary p-4 font-body-lg text-body-lg focus:outline-none focus:border-b-8 focus:bg-secondary-container transition-all placeholder:text-on-surface-variant group-focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                  placeholder="Enter clinical query..." 
                />
              </div>
              <Button type="submit" aria-label="Send Query" className="!bg-primary !text-secondary-container px-8 hover:!bg-secondary hover:!text-white">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">send</span>
              </Button>
            </form>
          </div>
        </section>
      </div>

      {/* Fixed Medical Disclaimer Footer */}
      <div className="w-full bg-[#FFD500] border-t-4 border-primary p-2 text-center z-50 shrink-0 hidden md:block">
        <p className="font-label-caps text-label-caps font-bold text-primary flex items-center justify-center gap-2 m-0">
          <span className="material-symbols-outlined">warning</span>
          AI ASSISTANT - NOT A DOCTOR. CLINICAL ACCURACY SUBJECT TO VERIFICATION.
        </p>
      </div>
    </Layout>
  );
}
