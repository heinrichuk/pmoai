
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkstreamStatusTable from '@/components/dashboard/WorkstreamStatusTable';
import StatusCard from '@/components/dashboard/StatusCard';
import { fetchWorkstreams } from '@/services/api';
import { Workstream } from '@/types/api';
import { toast } from 'sonner';
import { FileCheck, AlertCircle, CheckCheck } from 'lucide-react';
import { mockWorkstreams } from '@/mock/mockData';

const WorkstreamsPage: React.FC = () => {
  const [workstreams, setWorkstreams] = useState<Workstream[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, but fall back to mock data
        try {
          const data = await fetchWorkstreams();
          setWorkstreams(data);
        } catch (error) {
          console.log('Using mock workstream data');
          setWorkstreams(mockWorkstreams);
        }
      } catch (error) {
        console.error('Failed to fetch workstreams data:', error);
        toast.error('Failed to load workstreams data. Using mock data.');
        setWorkstreams(mockWorkstreams);
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
    <MainLayout title="Workstreams" subtitle="All Active Project Workstreams">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Workstreams</TabsTrigger>
            <TabsTrigger value="red">Red Status</TabsTrigger>
            <TabsTrigger value="amber">Amber Status</TabsTrigger>
            <TabsTrigger value="green">Green Status</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Workstreams</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkstreamStatusTable workstreams={workstreams} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="red">
            <Card>
              <CardHeader>
                <CardTitle>Red Status Workstreams</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkstreamStatusTable workstreams={workstreams.filter(ws => ws.status === 'red')} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="amber">
            <Card>
              <CardHeader>
                <CardTitle>Amber Status Workstreams</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkstreamStatusTable workstreams={workstreams.filter(ws => ws.status === 'amber')} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="green">
            <Card>
              <CardHeader>
                <CardTitle>Green Status Workstreams</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkstreamStatusTable workstreams={workstreams.filter(ws => ws.status === 'green')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default WorkstreamsPage;
