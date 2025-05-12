
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Milestone } from '@/types/api';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { fetchMilestones } from '@/services/api';
import { mockMilestones, getWorkstreamNameById } from '@/mock/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, but fall back to mock data
        try {
          const data = await fetchMilestones();
          setMilestones(data);
        } catch (error) {
          console.log('Using mock milestone data');
          setMilestones(mockMilestones);
        }
      } catch (error) {
        console.error('Failed to fetch milestones data:', error);
        toast.error('Failed to load milestones data. Using mock data.');
        setMilestones(mockMilestones);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'at_risk':
        return <Badge className="bg-ubs-red">At Risk</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'delayed':
        return <Badge variant="outline" className="text-ubs-red border-ubs-red">Delayed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Group milestones by month
  const groupedMilestones: Record<string, Milestone[]> = milestones.reduce((groups, milestone) => {
    const date = new Date(milestone.dueDate);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(milestone);
    return groups;
  }, {} as Record<string, Milestone[]>);

  return (
    <MainLayout title="Milestones" subtitle="Project Timeline and Key Deliverables">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Total Milestones
                <Calendar size={20} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{milestones.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {milestones.filter(m => m.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-ubs-red">
                {milestones.filter(m => m.status === 'at_risk').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Delayed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">
                {milestones.filter(m => m.status === 'delayed').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {Object.entries(groupedMilestones).map(([month, monthMilestones]) => (
          <Card key={month} className="overflow-hidden">
            <CardHeader className="bg-ubs-gray-100">
              <CardTitle>{month}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Workstream</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthMilestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell className="font-medium">{milestone.title}</TableCell>
                      <TableCell>{getWorkstreamNameById(milestone.workstreamId)}</TableCell>
                      <TableCell>{new Date(milestone.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(milestone.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default MilestonesPage;
