
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ChartBar,
  FileCheck,
  Home,
  AlertCircle,
  Calendar,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: <Home />, label: 'Dashboard' },
    { path: '/workstreams', icon: <ChartBar />, label: 'Workstreams' },
    { path: '/milestones', icon: <Calendar />, label: 'Milestones' },
    { path: '/risks-issues', icon: <AlertCircle />, label: 'Risks & Issues' },
    { path: '/dependencies', icon: <FileCheck />, label: 'Dependencies' },
    { path: '/chat', icon: <MessageSquare />, label: 'AI Assistant' },
  ];

  return (
    <div 
      className={cn(
        'h-screen bg-white border-r border-ubs-gray-100 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ marginRight: 0 }}
    >
      <div className="flex items-center h-16 px-4 border-b border-ubs-gray-100">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-ubs-red rounded flex items-center justify-center">
              <span className="text-white font-bold">UBS</span>
            </div>
            <span className="ml-2 font-semibold text-ubs-gray-700">GIC</span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <div className="h-8 w-8 bg-ubs-red rounded flex items-center justify-center">
              <span className="text-white font-bold">UBS</span>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 pt-2 pb-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === item.path 
                    ? 'bg-ubs-gray-100 text-ubs-red' 
                    : 'text-ubs-gray-600 hover:bg-ubs-gray-100',
                  collapsed ? 'justify-center' : ''
                )}
              >
                <span className={cn(collapsed ? 'text-lg' : 'mr-3')}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-2 border-t border-ubs-gray-100">
        <button 
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-ubs-gray-600 hover:bg-ubs-gray-100 rounded-md transition-colors"
        >
          {collapsed ? <ArrowRight /> : <><ArrowLeft /> <span className="ml-2">Collapse</span></>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
