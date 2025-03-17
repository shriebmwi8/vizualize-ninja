
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BarChart, Database, TrendingUp } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal bg-clip-text text-transparent">
              VizNinja
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            <Link
              to="/home"
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('/home')
                  ? 'bg-vizNinja-lightPurple text-vizNinja-purple font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </div>
            </Link>
            
            <Link
              to="/exploration"
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('/exploration')
                  ? 'bg-vizNinja-lightTeal text-vizNinja-teal font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Database className="h-4 w-4" />
                <span>Exploration</span>
              </div>
            </Link>
            
            <Link
              to="/visualizations"
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('/visualizations')
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <BarChart className="h-4 w-4" />
                <span>Visualizations</span>
              </div>
            </Link>
            
            <Link
              to="/regression"
              className={`px-4 py-2 rounded-md transition-colors ${
                isActive('/regression')
                  ? 'bg-green-100 text-green-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="h-4 w-4" />
                <span>Regression</span>
              </div>
            </Link>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
