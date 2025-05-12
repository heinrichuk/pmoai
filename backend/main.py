
from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import json
import os
import asyncio
import httpx
import schedule
from contextlib import asynccontextmanager
import threading
import time
from fastapi.staticfiles import StaticFiles
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("pmo-backend")

# Data models
class Workstream(BaseModel):
    id: str
    name: str
    description: str
    status: str
    lead: str
    lastUpdated: str

class Milestone(BaseModel):
    id: str
    workstreamId: str
    title: str
    description: str
    dueDate: str
    status: str

class Risk(BaseModel):
    id: str
    workstreamId: str
    title: str
    description: str
    impact: str
    likelihood: str
    mitigationPlan: str
    status: str

class Issue(BaseModel):
    id: str
    workstreamId: str
    title: str
    description: str
    severity: str
    status: str
    assignedTo: str

class Dependency(BaseModel):
    id: str
    sourceWorkstreamId: str
    targetWorkstreamId: str
    description: str
    status: str

class WorkstreamSentiment(BaseModel):
    id: str
    workstreamId: str
    date: str
    score: float
    keywords: List[str]
    summary: str

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str

class DataSnapshot(BaseModel):
    id: str
    date: str
    workstreams: List[Workstream]
    milestones: List[Milestone]
    risks: List[Risk]
    issues: List[Issue]
    dependencies: List[Dependency]

# In-memory storage (replace with database in production)
db = {
    "workstreams": [],
    "milestones": [],
    "risks": [],
    "issues": [],
    "dependencies": [],
    "sentiments": [],
    "snapshots": []
}

# Azure OpenAI settings
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15")

# Scheduled tasks
def schedule_snapshots():
    threading.Thread(target=run_scheduled_tasks, daemon=True).start()

def run_scheduled_tasks():
    logger.info("Starting scheduled tasks thread")
    
    def create_snapshot_job():
        logger.info("Running scheduled snapshot job")
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(create_snapshot_task())
    
    # Schedule snapshot creation every two weeks (Monday at midnight)
    schedule.every(2).weeks.at("00:00").do(create_snapshot_job)
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check schedule every minute

async def create_snapshot_task():
    try:
        snapshot_id = f"snapshot-{str(uuid.uuid4())}"
        new_snapshot = DataSnapshot(
            id=snapshot_id,
            date=datetime.now().isoformat(),
            workstreams=db["workstreams"],
            milestones=db["milestones"],
            risks=db["risks"],
            issues=db["issues"],
            dependencies=db["dependencies"]
        )
        
        # Add snapshot to database
        db["snapshots"].append(new_snapshot.dict())
        
        # Store in file system
        snapshot_folder = "snapshots"
        os.makedirs(snapshot_folder, exist_ok=True)
        
        with open(f"{snapshot_folder}/snapshot_{snapshot_id}.json", "w") as f:
            json.dump(new_snapshot.dict(), f, indent=2)
            
        logger.info(f"Created snapshot {snapshot_id}")
    except Exception as e:
        logger.error(f"Error creating snapshot: {str(e)}")

# Load sample data for development
def load_sample_data():
    # Sample workstreams
    workstreams = [
        {
            "id": "ws-1",
            "name": "Data Migration",
            "description": "Migrate legacy data to new platform",
            "status": "amber",
            "lead": "Jane Smith",
            "lastUpdated": (datetime.now() - timedelta(days=2)).isoformat()
        },
        {
            "id": "ws-2",
            "name": "User Interface",
            "description": "Develop new user interface components",
            "status": "green",
            "lead": "John Davis",
            "lastUpdated": datetime.now().isoformat()
        },
        {
            "id": "ws-3",
            "name": "API Development",
            "description": "Create new REST APIs for integration",
            "status": "red",
            "lead": "Robert Johnson",
            "lastUpdated": (datetime.now() - timedelta(days=1)).isoformat()
        },
        {
            "id": "ws-4",
            "name": "Testing",
            "description": "Quality assurance and testing",
            "status": "green",
            "lead": "Sarah Wilson",
            "lastUpdated": datetime.now().isoformat()
        }
    ]
    
    milestones = [
        {
            "id": "m-1",
            "workstreamId": "ws-1",
            "title": "Schema Migration",
            "description": "Complete the database schema migration",
            "dueDate": (datetime.now() + timedelta(days=10)).isoformat(),
            "status": "pending"
        },
        {
            "id": "m-2",
            "workstreamId": "ws-2",
            "title": "UI Prototype",
            "description": "Complete the UI prototype for review",
            "dueDate": (datetime.now() + timedelta(days=5)).isoformat(),
            "status": "completed"
        }
    ]
    
    risks = [
        {
            "id": "r-1",
            "workstreamId": "ws-1",
            "title": "Data Corruption",
            "description": "Risk of data corruption during migration",
            "impact": "high",
            "likelihood": "medium",
            "mitigationPlan": "Implement backup strategy and rollback plan",
            "status": "open"
        },
        {
            "id": "r-2",
            "workstreamId": "ws-3",
            "title": "API Security",
            "description": "Security vulnerabilities in API",
            "impact": "high",
            "likelihood": "low",
            "mitigationPlan": "Security review and penetration testing",
            "status": "mitigated"
        }
    ]
    
    issues = [
        {
            "id": "i-1",
            "workstreamId": "ws-3",
            "title": "Performance Issues",
            "description": "API response times are exceeding SLA",
            "severity": "high",
            "status": "open",
            "assignedTo": "Robert Johnson"
        },
        {
            "id": "i-2",
            "workstreamId": "ws-2",
            "title": "Browser Compatibility",
            "description": "UI not rendering correctly in Safari",
            "severity": "medium",
            "status": "in_progress",
            "assignedTo": "John Davis"
        }
    ]
    
    dependencies = [
        {
            "id": "d-1",
            "sourceWorkstreamId": "ws-1",
            "targetWorkstreamId": "ws-2",
            "description": "Data migration must be complete before UI can connect",
            "status": "pending"
        },
        {
            "id": "d-2",
            "sourceWorkstreamId": "ws-3",
            "targetWorkstreamId": "ws-4",
            "description": "APIs must be developed before testing can begin",
            "status": "pending"
        },
        {
            "id": "d-3",
            "sourceWorkstreamId": "ws-2",
            "targetWorkstreamId": "ws-4",
            "description": "UI must be complete before end-to-end testing",
            "status": "met"
        }
    ]
    
    db["workstreams"] = workstreams
    db["milestones"] = milestones
    db["risks"] = risks
    db["issues"] = issues
    db["dependencies"] = dependencies

# FastAPI application setup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load sample data on startup
    load_sample_data()
    
    # Start scheduled tasks
    schedule_snapshots()
    
    yield
    
    # Cleanup code can go here if needed
    pass

app = FastAPI(lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
@app.get("/workstreams", response_model=List[Workstream])
async def get_workstreams():
    return db["workstreams"]

@app.get("/workstreams/{workstream_id}", response_model=Workstream)
async def get_workstream(workstream_id: str):
    for ws in db["workstreams"]:
        if ws["id"] == workstream_id:
            return ws
    raise HTTPException(status_code=404, detail="Workstream not found")

@app.get("/milestones", response_model=List[Milestone])
async def get_milestones():
    return db["milestones"]

@app.get("/workstreams/{workstream_id}/milestones", response_model=List[Milestone])
async def get_workstream_milestones(workstream_id: str):
    return [m for m in db["milestones"] if m["workstreamId"] == workstream_id]

@app.get("/risks", response_model=List[Risk])
async def get_risks():
    return db["risks"]

@app.get("/workstreams/{workstream_id}/risks", response_model=List[Risk])
async def get_workstream_risks(workstream_id: str):
    return [r for r in db["risks"] if r["workstreamId"] == workstream_id]

@app.get("/issues", response_model=List[Issue])
async def get_issues():
    return db["issues"]

@app.get("/workstreams/{workstream_id}/issues", response_model=List[Issue])
async def get_workstream_issues(workstream_id: str):
    return [i for i in db["issues"] if i["workstreamId"] == workstream_id]

@app.get("/dependencies", response_model=List[Dependency])
async def get_dependencies():
    return db["dependencies"]

@app.get("/workstreams/{workstream_id}/sentiment", response_model=List[WorkstreamSentiment])
async def get_workstream_sentiment(workstream_id: str):
    # In a real application, this would come from a sentiment analysis service
    # For now, we'll just return sample data
    sentiment_data = [
        {
            "id": f"sent-{uuid.uuid4()}",
            "workstreamId": workstream_id,
            "date": (datetime.now() - timedelta(days=14)).isoformat(),
            "score": -0.3,
            "keywords": ["delayed", "risk", "issues", "vendor"],
            "summary": "The team is facing challenges with vendor integration."
        },
        {
            "id": f"sent-{uuid.uuid4()}",
            "workstreamId": workstream_id,
            "date": (datetime.now() - timedelta(days=7)).isoformat(),
            "score": 0.1,
            "keywords": ["progress", "issues", "pending", "mitigation"],
            "summary": "Some progress made but issues remain with the API integration."
        },
        {
            "id": f"sent-{uuid.uuid4()}",
            "workstreamId": workstream_id,
            "date": datetime.now().isoformat(),
            "score": 0.6,
            "keywords": ["resolved", "completed", "delivery", "milestone"],
            "summary": "Key issues resolved and the team completed the first milestone."
        }
    ]
    return sentiment_data

@app.post("/chat", response_model=ChatMessage)
async def handle_chat(chat_request: ChatRequest):
    # Check if Azure OpenAI credentials are available
    if not AZURE_OPENAI_ENDPOINT or not AZURE_OPENAI_KEY:
        # Fallback to mocked response if no Azure credentials
        logger.warning("Azure OpenAI credentials not found, using mock response")
        return mock_chat_response(chat_request.message)
    
    try:
        # Prepare system message with project context
        system_message = """
        You are a Project Management Assistant for UBS. You have access to information about 
        project workstreams, milestones, risks, issues, and dependencies. Provide concise, 
        helpful responses to questions about project status.
        
        Project context:
        - Data Migration workstream (status: AMBER)
        - User Interface workstream (status: GREEN)
        - API Development workstream (status: RED)
        - Testing workstream (status: GREEN)
        """
        
        # Process with Azure OpenAI
        response = await call_azure_openai(system_message, chat_request.message)
        
        return ChatMessage(
            id=f"msg-{uuid.uuid4()}",
            role="assistant",
            content=response,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        # Fallback to mock if there's an error
        return mock_chat_response(chat_request.message)

def mock_chat_response(user_message: str) -> ChatMessage:
    """Generate a mock response when Azure OpenAI is unavailable"""
    user_message_lower = user_message.lower()
    
    if "status" in user_message_lower and "data migration" in user_message_lower:
        response = "The Data Migration workstream is currently in AMBER status. There's a risk of data corruption that's being mitigated with a backup strategy."
    elif "api" in user_message_lower and "issue" in user_message_lower:
        response = "The API Development workstream has a critical issue with performance. Response times are exceeding the SLA, and this is currently assigned to Robert Johnson."
    elif "dependency" in user_message_lower:
        response = "There are three key dependencies in the project: 1) Data migration must complete before UI connection, 2) APIs must be developed before testing can begin, 3) UI must be complete before end-to-end testing."
    elif "sentiment" in user_message_lower:
        response = "The overall sentiment for the project has been improving over the last two weeks. The most recent sentiment analysis shows a positive trend with key issues being resolved."
    else:
        response = "I understand you're asking about project information. Could you please specify which workstream, milestone, risk, or issue you're interested in?"
    
    return ChatMessage(
        id=f"msg-{uuid.uuid4()}",
        role="assistant",
        content=response,
        timestamp=datetime.now().isoformat()
    )

async def call_azure_openai(system_message: str, user_message: str) -> str:
    """Call Azure OpenAI API"""
    url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"
    
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_KEY
    }
    
    payload = {
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 800,
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        response_json = response.json()
        
        if response.status_code == 200:
            return response_json["choices"][0]["message"]["content"]
        else:
            logger.error(f"Azure OpenAI API error: {response_json}")
            raise HTTPException(status_code=500, detail="Error processing request with Azure OpenAI")

@app.post("/snapshots", response_model=DataSnapshot)
async def create_snapshot_endpoint(background_tasks: BackgroundTasks):
    """Manually trigger a snapshot creation"""
    background_tasks.add_task(create_snapshot_task)
    
    # Return a message immediately while the task runs in the background
    return {
        "id": f"snapshot-{uuid.uuid4()}",
        "date": datetime.now().isoformat(),
        "message": "Snapshot creation started"
    }

@app.get("/snapshots", response_model=List[DataSnapshot])
async def get_snapshots():
    return db["snapshots"]

@app.post("/sync/{source}")
async def sync_from_source(source: str):
    if source not in ["sharepoint", "gitlab"]:
        raise HTTPException(status_code=400, detail="Invalid source. Must be 'sharepoint' or 'gitlab'")
    
    # In a real implementation, this would connect to the actual source
    # For now, just return success
    logger.info(f"Simulating data sync from {source}")
    
    # You would integrate with SharePoint/GitLab APIs here
    # For now, just update the lastUpdated field for demonstration
    for ws in db["workstreams"]:
        ws["lastUpdated"] = datetime.now().isoformat()
    
    return {"success": True, "message": f"Data synced from {source}"}

# Serve the frontend as static files in production
# (In development, the React app will be served separately)
if os.path.exists("../dist"):
    app.mount("/", StaticFiles(directory="../dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
