import React from 'react';
import { useLocation, Link } from 'wouter';
import { 
  BarChartIcon, 
  ClipboardCheckIcon, 
  BarChart2Icon, 
  ClockIcon, 
  SettingsIcon 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: BarChartIcon },
  { name: 'Assessments', href: '/assessment', icon: ClipboardCheckIcon },
  { name: 'Reports', href: '/results', icon: BarChart2Icon },
  { name: 'History', href: '/history', icon: ClockIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== '/' && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive
                      ? 'text-secondary bg-blue-50'
                      : 'text-primary hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
