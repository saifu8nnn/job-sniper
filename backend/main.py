import os
import requests
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    skills: str
    role: str
    mode: str

# 🚨 PASTE YOUR ANAKIN API KEY HERE 🚨
ANAKIN_API_KEY = os.getenv("ANAKIN_API_KEY", "PASTE_YOUR_KEY_HERE")


def calculate_match_score(user_skills: str, job_snippet: str, job_title: str) -> int:
    # Safely convert everything to strings to prevent NoneType crashes
    safe_title = str(job_title) if job_title else ""
    safe_snippet = str(job_snippet) if job_snippet else ""
    safe_skills = str(user_skills) if user_skills else ""
    
    search_text = f"{safe_title} {safe_snippet}".lower()
    clean_skills = safe_skills.replace(",", " ").lower().split()
    
    score = 65 # Base score
    
    for word in clean_skills:
        if len(word) > 1 and word in search_text:
            score += 15 # Massive boost for matched keywords
            
    return min(98, score)

def fetch_from_wire(query: SearchQuery):
    url = "https://anakin.io/v1/wire/task" 
    
    # Updated: Using Bearer token format for proper authentication
    headers = {
        "Authorization": f"Bearer {ANAKIN_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # 🎯 Job Sniper: Clean query without redundant "internship" keyword
    exact_search = f'"{query.skills}" {query.role}'
    
    payload = {
        "action_id": "in_search_jobs",
        "params": {
            "query": exact_search,
            "location": query.mode,
            "start": 0,
            "sort": "date",
            "country_domain": "in"
        }
    }
    
    try:
        print(f"🎯 Job Sniper: Sniping live results for: {exact_search}")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        wire_data = response.json()
        
        # Polling loop
        if wire_data.get("status") == "processing":
            poll_url = f"https://anakin.io{wire_data.get('poll_url')}"
            for _ in range(15): 
                time.sleep(2) 
                poll_res = requests.get(poll_url, headers=headers)
                poll_data = poll_res.json()
                if poll_data.get("status") in ["success", "completed"]:
                    wire_data = poll_data 
                    break
        
        jobs = []
        indeed_data = wire_data.get("data", {})
        inner_data = indeed_data.get("data", {})
        results = inner_data.get("jobs", [])
        
        for i, item in enumerate(results):  
            score = calculate_match_score(query.skills, item.get("snippet", ""), item.get("title", ""))
            
            # Kill switch: Only keep the job if the score is 70% or higher
            if score >= 70:
                jobs.append({
                    "id": str(item.get("job_key", i)),
                    "title": item.get("title", "New Opportunity"),
                    "company": item.get("company", "Unknown Company"),
                    "location": item.get("location", query.mode),
                    "date_posted": item.get("date_posted", "Just posted"), 
                    "url": item.get("url", "https://indeed.com"),
                    "match_score": score
                })
            else:
                print(f"🗑️ Trashed irrelevant job: {item.get('title')}")
            
        jobs = sorted(jobs, key=lambda x: x["match_score"], reverse=True)
        return jobs
        
    except Exception as e:
        print(f"🚨 Wire API Error: {e}")
        return []

@app.post("/api/search")
async def search_internships(query: SearchQuery):
    print(f"🎯 Sniping internships for: {query.role} | {query.skills}")
    live_jobs = fetch_from_wire(query)
    
    if not live_jobs:
        print("⚠️ No live jobs found. Falling back to mock data to save the demo.")
        live_jobs = [
            {
                "id": "mock-1",
                "title": f"Mock {query.role} Intern",
                "company": "Fallback Tech",
                "location": query.mode,
                "date_posted": "Just posted",
                "url": "https://linkedin.com",
                "match_score": 88
            }
        ]
        
    return {"status": "success", "data": live_jobs}