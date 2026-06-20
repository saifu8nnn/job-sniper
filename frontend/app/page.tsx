"use client";

import { useState } from 'react';

// --- Helper Functions ---
function getFreshnessBadge(postedString) {
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

// --- UI Micro-Icons ---
const TargetIcon = () => (
  <svg className="w-10 h-10 text-amber-600 inline-block mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const CodeIcon = () => (
  <svg className="w-5 h-5 text-amber-600 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-5 h-5 text-amber-600 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5 text-amber-600 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0110.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
  </svg>
);

// --- Circular Match Indicator ---
const CircularMatch = ({ percentage }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="transform -rotate-90 w-14 h-14">
        <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
        <circle 
          cx="28" cy="28" r={radius} 
          stroke="currentColor" 
          strokeWidth="3" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          className="text-amber-600 transition-all duration-1000 ease-out" 
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-amber-700">{percentage}%</span>
    </div>
  );
};

// --- Main Application ---
export default function Home() {
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [mode, setMode] = useState('Remote');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, role, mode }),
      });
      const result = await res.json();
      setJobs(result.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      // Dummy data for testing the UI if backend is offline
      if (jobs.length === 0) {
        setJobs([
          { id: 1, title: "Backend Engineer Intern", company: "Stripe", location: "San Francisco, CA", match_score: 92, date_posted: "Just posted", url: "#" },
          { id: 2, title: "React Developer Internship", company: "Vercel", location: "Remote", match_score: 85, date_posted: "2 hours ago", url: "#" },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50/40 text-gray-900 p-6 md:p-12 relative overflow-hidden" style={{ fontFamily: '"Sora", sans-serif' }}>
      
      {/* Auto-injecting Sora Font so you don't have to touch globals.css right now */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}} />

      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center">
            <TargetIcon /> Job Sniper
          </h1>
          <p className="text-gray-600 mt-4 text-lg font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
            Find fresh opportunities before everyone else. Smart matching for your next move.
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 md:p-10 mb-12 space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">Target Skills</label>
              <div className="relative">
                <CodeIcon />
                <input 
                  type="text" 
                  value={skills} 
                  onChange={e => setSkills(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-lg text-gray-900 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all placeholder-gray-400 font-normal" 
                  placeholder="Python, FastAPI, React..."
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">Desired Role</label>
              <div className="relative">
                <BriefcaseIcon />
                <input 
                  type="text" 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-lg text-gray-900 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all placeholder-gray-400 font-normal" 
                  placeholder="Backend Engineer..."
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">Work Mode</label>
              <div className="relative">
                <GlobeIcon />
                <select 
                  value={mode} 
                  onChange={e => setMode(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-lg text-gray-900 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all appearance-none font-normal"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>

          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 tracking-wide"
          >
            {loading ? (
              <span className="animate-pulse">Sniping listings...</span>
            ) : (
              <>
                <span>Initiate Search</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Results Stream */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="group bg-white rounded-xl border border-amber-100 p-6 hover:border-amber-300 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BuildingIcon />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
                      {getFreshnessBadge(job.date_posted)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{job.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 font-normal">{job.company} <span className="mx-1 text-gray-300">•</span> {job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t border-amber-50 md:border-none pt-4 md:pt-0">
                <div className="flex flex-col items-center">
                  <CircularMatch percentage={job.match_score || 85} />
                </div>
                
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 hover:border-amber-500 px-6 py-2.5 rounded-lg text-sm transition-all"
                >
                  Apply Now
                </a>
              </div>

            </div>
          ))}
          
          {jobs.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-normal">Configure your targets and initiate the search.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}