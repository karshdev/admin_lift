import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  ChevronsLeft, 
  ChevronsRight, 
  Circle, 
  ChevronDown, 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Sections array
  const sections = [
    { name: 'Interviewer Management', href: '/admin/interviewers' },
  ];

  // Check if a route is active
  const isActive = (path) => location.pathname === path;

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Sidebar Navigation Item Component
  const NavItem = ({ icon: Icon, label, href, isDropdown = false, children }) => {
    const active = isActive(href);
    
    const itemContent = (
      <div className={`
        flex items-center justify-between p-3 rounded-lg transition-colors duration-200
        ${active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
        ${isOpen ? 'w-full' : 'justify-center'}
      `}>
        <div className="flex items-center space-x-3">
          <Icon className={`
            ${isOpen ? 'mr-3' : ''}
            ${active ? 'text-blue-600' : 'text-gray-500'}
          `} size={20} />
          {isOpen && <span className="font-medium">{label}</span>}
        </div>
        
        {isOpen && isDropdown && (
          <ChevronDown 
            size={16} 
            className={`
              transition-transform 
              ${isDropdownOpen ? 'rotate-180' : ''}
            `} 
          />
        )}
      </div>
    );

    // If it's a dropdown item
    if (isDropdown) {
      return (
        <div>
          <button 
            onClick={toggleDropdown} 
            className="w-full text-left"
          >
            {itemContent}
          </button>
          
          {isDropdownOpen && isOpen && (
            <div className="pl-4 mt-2 space-y-2">
              {children}
            </div>
          )}
        </div>
      );
    }

    // Regular navigation item
    return (
      <Link to={href} className="block w-full">
        {itemContent}
      </Link>
    );
  };

  // Dropdown Subitem Component
  const SubNavItem = ({ href, label }) => {
    const active = isActive(href);
    
    return (
      <Link 
        to={href} 
        className={`
          flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200
          ${active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
        `}
      >
        <Circle 
          size={10} 
          className={`
            ${active ? 'text-blue-600 fill-blue-600' : 'text-gray-400'}
          `} 
        />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div 
      className={`
        fixed top-0 left-0 bottom-0 z-50 bg-white shadow-lg 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-72' : 'w-20'}
        border-r border-gray-100 overflow-hidden
      `}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-100 h-16"
      >
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="rounded-full w-10 h-10"
            />
            <span className="text-lg font-bold text-gray-800">LIFT</span>
          </div>
        ) : (
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="rounded-full w-10 h-10 mx-auto"
          />
        )}

        {/* Sidebar Toggle */}
        <button 
          onClick={toggleSidebar} 
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <NavItem 
          icon={Home} 
          label="Dashboard" 
          href="/" 
          isDropdown 
        >
          {sections.map((section, index) => (
            <SubNavItem 
              key={index} 
              href={section.href} 
              label={section.name} 
            />
          ))}
        </NavItem>

        <NavItem 
          icon={Settings} 
          label="Settings" 
          href="/settings" 
        />
      </nav>
    </div>
  );
};

export default Sidebar;