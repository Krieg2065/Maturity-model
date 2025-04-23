import React from 'react';
import AppTabs from '@/components/AppTabs';
import ActionCards from '@/components/dashboard/ActionCards';
import MaturityChart from '@/components/dashboard/MaturityChart';
import KeyInsights from '@/components/dashboard/KeyInsights';

const tabs = [
  { label: 'Dashboard', path: '/' },
  { label: 'New Assessment', path: '/assessment' },
  { label: 'History', path: '/history' }
];

const Dashboard: React.FC = () => {
  return (
    <div>
      <AppTabs tabs={tabs} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Maturity Assessment Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your organization's progress and identify areas for improvement.
        </p>
      </div>
      
      <ActionCards />
      <MaturityChart />
      <KeyInsights />
    </div>
  );
};

export default Dashboard;
