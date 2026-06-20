"use client";

import { useState, FormEvent, ChangeEvent } from 'react';

// --- Helper Functions ---
function getFreshnessBadge(postedString: any) {
  if (!postedString) return "✨ Just posted";
  const lowerStr = postedString.toLowerCase();
  
  if (lowerStr.includes("just") || lowerStr.includes("minute")) {
    return `✨ ${postedString}`;
  } else if (lowerStr.includes("hour")) {
    return `⏱ ${postedString}`;
  } else {
    return `📅 ${postedString}`;
  }
}

// --- UI Icons ---
const TargetIcon = () => (
  <svg className="w-10 h-10 text-amber-600 inline-block mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const CodeIcon = () => (
  <svg className="w-5 h-5 text-amber-600 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-5 h-5 text-amber-600 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5 text-amber-600 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0110.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
  </svg>
);

const CircularMatch = ({ percentage }: { percentage: number }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="transform -rotate-90 w-14 h-14">
        <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
        <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-amber-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-bold text-amber-700">{percentage}%</span>
    </div>
  );
};

export default function Home() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [mode, setMode] = useState('Remote');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    // Pro-level validation
    if (!skills.trim()) {
      alert("Please enter target skills to start sniping!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, role, mode }),
      });
      const result = await res.json();
      setJobs(result.data || []);
    } catch (err) {
      setJobs([{ id: 1, title: "Backend Engineer Intern", company: "Stripe", location: "San Francisco", match_score: 92, date_posted: "Just posted", url: "#" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50/40 text-gray-900 p-6 md:p-12" style={{ fontFamily: '"Sora", sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');`}} />
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 flex items-center justify-center">
            <TargetIcon /> Job Sniper
          </h1>
        </header>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Target Skills</label>
              <div className="relative">
                <CodeIcon />
                <input type="text" value={skills} onChange={(e: ChangeEvent<HTMLInputElement>) => setSkills(e.target.value)} className="w-full pl-10 py-3 bg-stone-50 rounded-lg border border-amber-200 outline-none" placeholder="Python, FastAPI..." />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Desired Role</label>
              <div className="relative">
                <BriefcaseIcon />
                <input type="text" value={role} onChange={(e: ChangeEvent<HTMLInputElement>) => setRole(e.target.value)} className="w-full pl-10 py-3 bg-stone-50 rounded-lg border border-amber-200 outline-none" placeholder="Backend Engineer..." />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Work Mode</label>
              <div className="relative">
                <GlobeIcon />
                <select value={mode} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMode(e.target.value)} className="w-full pl-10 py-3 bg-stone-50 rounded-lg border border-amber-200 outline-none appearance-none">
                  <option>Remote</option><option>Hybrid</option><option>Onsite</option>
                </select>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!skills.trim()}
            className={`w-full font-bold py-3 rounded-lg shadow-md transition-all ${
              !skills.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {loading ? "Sniping..." : "Initiate Search"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id} className="bg-white rounded-xl border border-amber-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
              <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <BuildingIcon />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{getFreshnessBadge(job.date_posted)}</span>
                  <h3 className="font-bold text-gray-900">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.company} • {job.location}</p>
                </div>
              </div>
              <CircularMatch percentage={job.match_score || 85} />
              <a href={job.url} target="_blank" rel="noreferrer" className="bg-amber-50 text-amber-700 border border-amber-300 px-6 py-2 rounded-lg text-sm font-bold hover:bg-amber-100">Apply Now</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}