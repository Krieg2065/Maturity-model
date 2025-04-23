import React from 'react';
import { useLocation, useRoute } from 'wouter';

interface TabConfig {
  label: string;
  path: string;
}

interface AppTabsProps {
  tabs: TabConfig[];
}

const AppTabs: React.FC<AppTabsProps> = ({ tabs }) => {
  const [location, setLocation] = useLocation();

  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex space-x-8">
        {tabs.map((tab) => {
          const isActive = 
            (tab.path === '/' && location === '/') || 
            (tab.path !== '/' && location.startsWith(tab.path));
          
          return (
            <button
              key={tab.path}
              className={`tab ${isActive ? 'active' : ''}`}
              onClick={() => setLocation(tab.path)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppTabs;
