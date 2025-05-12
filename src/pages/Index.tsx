
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatusCard from '@/components/dashboard/StatusCard';
import WorkstreamStatusTable from '@/components/dashboard/WorkstreamStatusTable';
import DependencyVisualizer from '@/components/dashboard/DependencyVisualizer';
import SentimentChart from '@/components/dashboard/SentimentChart';
import { fetchWorkstreams, fetchDependencies } from '@/services/api';
import { Workstream, Dependency, WorkstreamSentiment } from '@/types/api';
import { AlertCircle, Calendar, CheckCheck, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

// Mock sentiment data (would come from the API in a real app)
const mockSentimentData: WorkstreamSentiment[] = [
  {
    id: '1',
    workstreamId: 'ws-1',
    date: '2025-04-29T00:00:00Z',
    score: -0.3,
    keywords: ['delayed', 'risk', 'issues', 'vendor'],
    summary: 'The team is facing challenges with vendor integration.'
  },
  {
    id: '2',
    workstreamId: 'ws-1',
    date: '2025-05-01T00:00:00Z',
    score: 0.1,
    keywords: ['progress', 'issues', 'pending', 'mitigation'],
    summary: 'Some progress made but issues remain with the API integration.'
  },
  {
    id: '3',
    workstreamId: 'ws-1',
    date: '2025-05-11T00:00:00Z',
    score: 0.6,
    keywords: ['resolved', 'completed', 'delivery', 'milestone'],
    summary: 'Key issues resolved and the team completed the first milestone.'
  }
];

const Dashboard = () => {
  const [workstreams, setWorkstreams] = useState<Workstream[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const workstreamsData = await fetchWorkstreams();
        const dependenciesData = await fetchDependencies();
        
        setWorkstreams(workstreamsData);
        setDependencies(dependenciesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Count workstreams by status
  const redWorkstreams = workstreams.filter(ws => ws.status === 'red').length;
  const amberWorkstreams = workstreams.filter(ws => ws.status === 'amber').length;
  const greenWorkstreams = workstreams.filter(ws => ws.status === 'green').length;
  
  return (
    <MainLayout title="Dashboard" subtitle="Project Management Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total Workstreams" 
            count={workstreams.length} 
            icon={<FileCheck size={20} />} 
          />
          <StatusCard 
            title="Red Status" 
            count={redWorkstreams} 
            status="red"
            icon={<AlertCircle size={20} />} 
          />
          <StatusCard 
            title="Amber Status" 
            count={amberWorkstreams} 
            status="amber"
            icon={<AlertCircle size={20} />} 
          />
          <StatusCard 
            title="Green Status" 
            count={greenWorkstreams} 
            status="green"
            icon={<CheckCheck size={20} />} 
          />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-ubs-gray-700">Workstream Status</h2>
            <WorkstreamStatusTable workstreams={workstreams} />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-ubs-gray-700">Dependencies Visualization</h2>
            <DependencyVisualizer 
              dependencies={dependencies}
              workstreams={workstreams}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold text-ubs-gray-700 mb-4">Sentiment Analysis</h2>
          <SentimentChart sentimentData={mockSentimentData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
