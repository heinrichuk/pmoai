
export interface Workstream {
  id: string;
  name: string;
  description: string;
  status: 'red' | 'amber' | 'green';
  lead: string;
  lastUpdated: string;
}

export interface Milestone {
  id: string;
  workstreamId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'at_risk' | 'delayed';
}

export interface Risk {
  id: string;
  workstreamId: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
  mitigationPlan: string;
  status: 'open' | 'mitigated' | 'closed';
}

export interface Issue {
  id: string;
  workstreamId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo: string;
}

export interface Dependency {
  id: string;
  sourceWorkstreamId: string;
  targetWorkstreamId: string;
  description: string;
  status: 'pending' | 'met' | 'at_risk';
}

export interface WorkstreamSentiment {
  id: string;
  workstreamId: string;
  date: string;
  score: number; // -1 to 1
  keywords: string[];
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DataSnapshot {
  id: string;
  date: string;
  workstreams: Workstream[];
  milestones: Milestone[];
  risks: Risk[];
  issues: Issue[];
  dependencies: Dependency[];
}
