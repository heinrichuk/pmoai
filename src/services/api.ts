
import { 
  Workstream, 
  Milestone, 
  Risk, 
  Issue, 
  Dependency, 
  WorkstreamSentiment,
  DataSnapshot,
  ChatMessage
} from "../types/api";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Workstreams
export async function fetchWorkstreams(): Promise<Workstream[]> {
  return apiRequest<Workstream[]>('/workstreams');
}

export async function fetchWorkstreamById(id: string): Promise<Workstream> {
  return apiRequest<Workstream>(`/workstreams/${id}`);
}

// Milestones
export async function fetchMilestones(workstreamId?: string): Promise<Milestone[]> {
  const endpoint = workstreamId ? `/workstreams/${workstreamId}/milestones` : '/milestones';
  return apiRequest<Milestone[]>(endpoint);
}

// Risks
export async function fetchRisks(workstreamId?: string): Promise<Risk[]> {
  const endpoint = workstreamId ? `/workstreams/${workstreamId}/risks` : '/risks';
  return apiRequest<Risk[]>(endpoint);
}

// Issues
export async function fetchIssues(workstreamId?: string): Promise<Issue[]> {
  const endpoint = workstreamId ? `/workstreams/${workstreamId}/issues` : '/issues';
  return apiRequest<Issue[]>(endpoint);
}

// Dependencies
export async function fetchDependencies(): Promise<Dependency[]> {
  return apiRequest<Dependency[]>('/dependencies');
}

// Sentiment Analysis
export async function fetchWorkstreamSentiment(workstreamId: string): Promise<WorkstreamSentiment[]> {
  return apiRequest<WorkstreamSentiment[]>(`/workstreams/${workstreamId}/sentiment`);
}

// Chat API
export async function sendChatMessage(message: string): Promise<ChatMessage> {
  return apiRequest<ChatMessage>('/chat', 'POST', { message });
}

// Data Snapshots
export async function fetchSnapshots(): Promise<DataSnapshot[]> {
  return apiRequest<DataSnapshot[]>('/snapshots');
}

export async function createSnapshot(): Promise<DataSnapshot> {
  return apiRequest<DataSnapshot>('/snapshots', 'POST');
}

// Data sources (SharePoint/GitLab)
export async function syncDataFromSource(source: 'sharepoint' | 'gitlab'): Promise<boolean> {
  return apiRequest<boolean>(`/sync/${source}`, 'POST');
}
