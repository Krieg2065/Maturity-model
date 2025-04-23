import React from 'react';
import { BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-primary font-bold text-2xl">MaturityMetrics</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <BellIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium hidden sm:inline">John Smith</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white">JS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
