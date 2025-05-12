
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Risk, Issue } from '@/types/api';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchRisks, fetchIssues } from '@/services/api';
import { mockRisks, mockIssues, getWorkstreamNameById } from '@/mock/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RisksIssuesPage: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, but fall back to mock data
        try {
          const risksData = await fetchRisks();
          const issuesData = await fetchIssues();
          setRisks(risksData);
          setIssues(issuesData);
        } catch (error) {
          console.log('Using mock risks and issues data');
          setRisks(mockRisks);
          setIssues(mockIssues);
        }
      } catch (error) {
        console.error('Failed to fetch risks and issues data:', error);
        toast.error('Failed to load risks and issues data. Using mock data.');
        setRisks(mockRisks);
        setIssues(mockIssues);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get impact/severity badge
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-ubs-red">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string, type: 'risk' | 'issue') => {
    if (type === 'risk') {
      switch (status) {
        case 'open':
          return <Badge variant="outline" className="border-ubs-red text-ubs-red">Open</Badge>;
        case 'mitigated':
          return <Badge className="bg-green-500">Mitigated</Badge>;
        case 'closed':
          return <Badge variant="outline" className="border-gray-400 text-gray-400">Closed</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    } else {
      switch (status) {
        case 'open':
          return <Badge variant="outline" className="border-ubs-red text-ubs-red">Open</Badge>;
        case 'in_progress':
          return <Badge className="bg-amber-500">In Progress</Badge>;
        case 'resolved':
          return <Badge className="bg-green-500">Resolved</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    }
  };

  return (
    <MainLayout title="Risks & Issues" subtitle="Project Risks and Issues Tracking">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Total Risks
                <AlertCircle size={20} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{risks.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                Total Issues
                <AlertCircle size={20} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{issues.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">High Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-ubs-red">
                {risks.filter(r => r.impact === 'high').length + 
                 issues.filter(i => i.severity === 'high').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Open Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {risks.filter(r => r.status === 'open').length + 
                 issues.filter(i => i.status === 'open').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="risks" className="w-full">
          <TabsList>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          <TabsContent value="risks">
            <Card>
              <CardHeader>
                <CardTitle>Project Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Risk</TableHead>
                      <TableHead>Workstream</TableHead>
                      <TableHead>Impact</TableHead>
                      <TableHead>Likelihood</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{risk.title}</div>
                            <div className="text-sm text-ubs-gray-600">{risk.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getWorkstreamNameById(risk.workstreamId)}</TableCell>
                        <TableCell>{getImpactBadge(risk.impact)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              risk.likelihood === 'high' 
                                ? 'border-ubs-red text-ubs-red' 
                                : risk.likelihood === 'medium' 
                                ? 'border-amber-500 text-amber-500' 
                                : 'border-green-500 text-green-500'
                            )}
                          >
                            {risk.likelihood.charAt(0).toUpperCase() + risk.likelihood.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(risk.status, 'risk')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Project Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Workstream</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{issue.title}</div>
                            <div className="text-sm text-ubs-gray-600">{issue.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getWorkstreamNameById(issue.workstreamId)}</TableCell>
                        <TableCell>{getImpactBadge(issue.severity)}</TableCell>
                        <TableCell>{issue.assignedTo}</TableCell>
                        <TableCell>{getStatusBadge(issue.status, 'issue')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default RisksIssuesPage;
