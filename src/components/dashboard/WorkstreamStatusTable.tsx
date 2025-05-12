
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Workstream } from '@/types/api';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface WorkstreamStatusTableProps {
  workstreams: Workstream[];
}

const WorkstreamStatusTable: React.FC<WorkstreamStatusTableProps> = ({ workstreams }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'red':
        return 'bg-ubs-red';
      case 'amber':
        return 'bg-amber-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-ubs-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workstream</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workstreams.map((workstream) => (
            <TableRow key={workstream.id}>
              <TableCell className="font-medium">
                <Link 
                  to={`/workstreams/${workstream.id}`}
                  className="text-ubs-red hover:underline"
                >
                  {workstream.name}
                </Link>
              </TableCell>
              <TableCell>{workstream.lead}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span 
                    className={cn(
                      "h-3 w-3 rounded-full mr-2",
                      getStatusBadgeClass(workstream.status)
                    )}
                  />
                  <span className="capitalize">{workstream.status}</span>
                </div>
              </TableCell>
              <TableCell>{new Date(workstream.lastUpdated).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkstreamStatusTable;
