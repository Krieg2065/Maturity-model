import React from 'react';
import AppTabs from '@/components/AppTabs';
import HistoryView from '@/components/history/HistoryView';

const tabs = [
  { label: 'Dashboard', path: '/' },
  { label: 'New Assessment', path: '/assessment' },
  { label: 'History', path: '/history' }
];

const History: React.FC = () => {
  return (
    <div>
      <AppTabs tabs={tabs} />
      <HistoryView />
    </div>
  );
};

export default History;
