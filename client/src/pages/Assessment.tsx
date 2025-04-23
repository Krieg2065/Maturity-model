import React from 'react';
import AppTabs from '@/components/AppTabs';
import AssessmentForm from '@/components/assessment/AssessmentForm';

const tabs = [
  { label: 'Dashboard', path: '/' },
  { label: 'New Assessment', path: '/assessment' },
  { label: 'History', path: '/history' }
];

const Assessment: React.FC = () => {
  return (
    <div>
      <AppTabs tabs={tabs} />
      <AssessmentForm />
    </div>
  );
};

export default Assessment;
