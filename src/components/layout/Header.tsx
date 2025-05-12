
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { syncDataFromSource } from '@/services/api';
import { toast } from 'sonner';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const handleSyncData = async (source: 'sharepoint' | 'gitlab') => {
    try {
      await syncDataFromSource(source);
      toast.success(`Successfully synced data from ${source}`);
    } catch (error) {
      toast.error(`Failed to sync data from ${source}`);
      console.error(error);
    }
  };

  return (
    <div className="bg-white border-b border-ubs-gray-100 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-ubs-gray-700">{title}</h1>
          {subtitle && <p className="text-sm text-ubs-gray-400">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleSyncData('sharepoint')}
          >
            Sync SharePoint
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleSyncData('gitlab')}
          >
            Sync GitLab
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
