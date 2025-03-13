
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Table } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart className="h-8 w-8 text-vizNinja-purple" />
              <span className="ml-2 text-xl font-bold text-vizNinja-darkGray">
                Visualize<span className="text-vizNinja-purple">Ninja</span>
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-vizNinja-lightPurple text-vizNinja-purple'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                <span>Home</span>
              </div>
            </Link>
            
            <Link
              to="/exploration"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isActive('/exploration')
                  ? 'bg-vizNinja-lightPurple text-vizNinja-purple'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Table className="h-4 w-4 mr-2" />
                <span>Exploration</span>
              </div>
            </Link>
            
            <Link
              to="/visualizations"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isActive('/visualizations')
                  ? 'bg-vizNinja-lightPurple text-vizNinja-purple'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                <span>Visualizations</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
