
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  count: number;
  status?: 'red' | 'amber' | 'green' | 'default';
  icon?: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  count, 
  status = 'default',
  icon
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'red':
        return 'bg-ubs-red text-white';
      case 'amber':
        return 'bg-amber-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      default:
        return 'bg-white text-ubs-gray-700';
    }
  };

  return (
    <Card className={cn(
      'border-none shadow-sm',
      status !== 'default' && getStatusColor()
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          {icon && <span>{icon}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{count}</p>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
