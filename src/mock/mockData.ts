
import { 
  Workstream, 
  Milestone, 
  Risk, 
  Issue, 
  Dependency
} from "../types/api";

// Mock Workstreams
export const mockWorkstreams: Workstream[] = [
  {
    id: 'ws-1',
    name: 'Core Banking Platform Migration',
    description: 'Migrate legacy systems to the new cloud-based banking platform',
    status: 'amber',
    lead: 'John Smith',
    lastUpdated: '2025-05-10T14:30:00Z'
  },
  {
    id: 'ws-2',
    name: 'Client Onboarding Redesign',
    description: 'Streamline and digitize the client onboarding process',
    status: 'green',
    lead: 'Anna Johnson',
    lastUpdated: '2025-05-11T09:15:00Z'
  },
  {
    id: 'ws-3',
    name: 'Regulatory Compliance Framework',
    description: 'Implement new regulatory compliance framework',
    status: 'red',
    lead: 'Robert Chen',
    lastUpdated: '2025-05-09T16:45:00Z'
  },
  {
    id: 'ws-4',
    name: 'Mobile App Enhancement',
    description: 'Enhance mobile app with new features and improved UX',
    status: 'green',
    lead: 'Sarah Williams',
    lastUpdated: '2025-05-12T11:20:00Z'
  },
  {
    id: 'ws-5',
    name: 'Data Lake Implementation',
    description: 'Build enterprise data lake for analytics and reporting',
    status: 'amber',
    lead: 'Michael Brown',
    lastUpdated: '2025-05-08T13:10:00Z'
  }
];

// Mock Milestones
export const mockMilestones: Milestone[] = [
  {
    id: 'ms-1',
    workstreamId: 'ws-1',
    title: 'Platform Architecture Design',
    description: 'Complete the architecture design for the new banking platform',
    dueDate: '2025-06-15T00:00:00Z',
    status: 'completed'
  },
  {
    id: 'ms-2',
    workstreamId: 'ws-1',
    title: 'Data Migration Strategy',
    description: 'Develop strategy for migrating data to the new platform',
    dueDate: '2025-07-01T00:00:00Z',
    status: 'at_risk'
  },
  {
    id: 'ms-3',
    workstreamId: 'ws-2',
    title: 'Digital Onboarding Prototype',
    description: 'Develop and test digital onboarding prototype',
    dueDate: '2025-06-20T00:00:00Z',
    status: 'pending'
  },
  {
    id: 'ms-4',
    workstreamId: 'ws-3',
    title: 'Regulatory Gap Analysis',
    description: 'Complete gap analysis against new regulatory requirements',
    dueDate: '2025-06-10T00:00:00Z',
    status: 'delayed'
  },
  {
    id: 'ms-5',
    workstreamId: 'ws-4',
    title: 'App UI Redesign',
    description: 'Complete UI redesign for mobile app',
    dueDate: '2025-06-25T00:00:00Z',
    status: 'completed'
  },
  {
    id: 'ms-6',
    workstreamId: 'ws-5',
    title: 'Data Model Design',
    description: 'Design data model for the enterprise data lake',
    dueDate: '2025-06-05T00:00:00Z',
    status: 'pending'
  }
];

// Mock Risks
export const mockRisks: Risk[] = [
  {
    id: 'risk-1',
    workstreamId: 'ws-1',
    title: 'System Integration Complexity',
    description: 'Integration with legacy systems more complex than anticipated',
    impact: 'high',
    likelihood: 'medium',
    mitigationPlan: 'Engage additional integration specialists and extend timeline',
    status: 'open'
  },
  {
    id: 'risk-2',
    workstreamId: 'ws-2',
    title: 'Regulatory Approval Delay',
    description: 'Delay in getting regulatory approval for digital signatures',
    impact: 'high',
    likelihood: 'low',
    mitigationPlan: 'Early engagement with regulatory bodies and preparation of alternative options',
    status: 'mitigated'
  },
  {
    id: 'risk-3',
    workstreamId: 'ws-3',
    title: 'Resource Constraints',
    description: 'Insufficient compliance expertise within the team',
    impact: 'medium',
    likelihood: 'high',
    mitigationPlan: 'Hire external compliance consultants and train existing staff',
    status: 'open'
  },
  {
    id: 'risk-4',
    workstreamId: 'ws-4',
    title: 'App Performance Issues',
    description: 'New features may degrade app performance',
    impact: 'medium',
    likelihood: 'medium',
    mitigationPlan: 'Implement performance testing at each development stage',
    status: 'mitigated'
  },
  {
    id: 'risk-5',
    workstreamId: 'ws-5',
    title: 'Data Quality Issues',
    description: 'Poor data quality affecting analysis capabilities',
    impact: 'high',
    likelihood: 'high',
    mitigationPlan: 'Implement data cleansing and validation procedures',
    status: 'open'
  }
];

// Mock Issues
export const mockIssues: Issue[] = [
  {
    id: 'issue-1',
    workstreamId: 'ws-1',
    title: 'API Documentation Incomplete',
    description: 'Third-party API documentation is incomplete, blocking integration',
    severity: 'high',
    status: 'open',
    assignedTo: 'David Wilson'
  },
  {
    id: 'issue-2',
    workstreamId: 'ws-2',
    title: 'User Testing Feedback',
    description: 'Negative feedback from users on the new onboarding flow',
    severity: 'medium',
    status: 'in_progress',
    assignedTo: 'Emily Parker'
  },
  {
    id: 'issue-3',
    workstreamId: 'ws-3',
    title: 'Missing Compliance Documentation',
    description: 'Required compliance documentation not provided by business unit',
    severity: 'high',
    status: 'open',
    assignedTo: 'Robert Chen'
  },
  {
    id: 'issue-4',
    workstreamId: 'ws-4',
    title: 'iOS Build Failure',
    description: 'Continuous integration build failing for iOS version',
    severity: 'medium',
    status: 'in_progress',
    assignedTo: 'James Lee'
  },
  {
    id: 'issue-5',
    workstreamId: 'ws-5',
    title: 'Data Pipeline Timeout',
    description: 'ETL pipeline timing out for large data sets',
    severity: 'high',
    status: 'resolved',
    assignedTo: 'Michael Brown'
  }
];

// Mock Dependencies
export const mockDependencies: Dependency[] = [
  {
    id: 'dep-1',
    sourceWorkstreamId: 'ws-1',
    targetWorkstreamId: 'ws-2',
    description: 'Core banking platform needs to be ready before new onboarding can go live',
    status: 'pending'
  },
  {
    id: 'dep-2',
    sourceWorkstreamId: 'ws-1',
    targetWorkstreamId: 'ws-5',
    description: 'Data lake needs core banking data model',
    status: 'met'
  },
  {
    id: 'dep-3',
    sourceWorkstreamId: 'ws-3',
    targetWorkstreamId: 'ws-2',
    description: 'Compliance framework needed for new onboarding process',
    status: 'at_risk'
  },
  {
    id: 'dep-4',
    sourceWorkstreamId: 'ws-4',
    targetWorkstreamId: 'ws-1',
    description: 'Mobile app needs core banking APIs',
    status: 'pending'
  },
  {
    id: 'dep-5',
    sourceWorkstreamId: 'ws-5',
    targetWorkstreamId: 'ws-3',
    description: 'Data lake needs to implement compliance reporting requirements',
    status: 'met'
  }
];

// Function to get workstream name by ID
export const getWorkstreamNameById = (id: string): string => {
  const workstream = mockWorkstreams.find(ws => ws.id === id);
  return workstream ? workstream.name : 'Unknown Workstream';
};
