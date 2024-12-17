import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Siderbar'; 

const App = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 p-6 bg-[#f8f7fa] transition-all duration-300 ${isOpen ? 'ml-72' : 'ml-20'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
