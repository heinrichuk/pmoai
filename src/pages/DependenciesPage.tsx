
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dependency } from '@/types/api';
import { FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { fetchDependencies } from '@/services/api';
import { mockDependencies, getWorkstreamNameById } from '@/mock/mockData';
import { Badge } from '@/components/ui/badge';
import DependencyVisualizer from '@/components/dashboard/DependencyVisualizer';
import { mockWorkstreams } from '@/mock/mockData';

const DependenciesPage: React.FC = () => {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, but fall back to mock data
        try {
          const data = await fetchDependencies();
          setDependencies(data);
        } catch (error) {
          console.log('Using mock dependencies data');
          setDependencies(mockDependencies);
        }
      } catch (error) {
        console.error('Failed to fetch dependencies data:', error);
        toast.error('Failed to load dependencies data. Using mock data.');
        setDependencies(mockDependencies);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'met':
        return <Badge className="bg-green-500">Met</Badge>;
      case 'at_risk':
        return <Badge className="bg-ubs-red">At Risk</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const metCount = dependencies.filter(d => d.status === 'met').length;
  const atRiskCount = dependencies.filter(d => d.status === 'at_risk').length;
  const pendingCount = dependencies.filter(d => d.status === 'pending').length;

  return (
    <MainLayout title="Dependencies" subtitle="Inter-workstream Dependencies">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Total Dependencies
                <FileCheck size={20} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{dependencies.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Met</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{metCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-ubs-red">{atRiskCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">{pendingCount}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dependencies Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <DependencyVisualizer 
                  dependencies={dependencies}
                  workstreams={mockWorkstreams}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dependencies Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependencies.map((dependency) => (
                    <TableRow key={dependency.id}>
                      <TableCell>
                        <div className="font-medium">
                          {getWorkstreamNameById(dependency.sourceWorkstreamId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {getWorkstreamNameById(dependency.targetWorkstreamId)}
                        </div>
                        <div className="text-sm text-ubs-gray-600">
                          {dependency.description}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(dependency.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DependenciesPage;
