import React from 'react';

import { useSidebarState } from './hooks/useSidebarState';
import { navLinks } from '../../constants/navLinks';
import SidebarNav from './components/SidebarNav';
import SidebarHeader from './components/SidebarHeader';
import UserProfile from './components/UserProfile';

import './Sidebar.css';
const Sidebar = ({ username = "User Name" }) => {
  const { isCollapsed, toggleSidebar } = useSidebarState();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <SidebarNav 
        links={navLinks} 
        isCollapsed={isCollapsed} 
      />
      
      <UserProfile 
        isCollapsed={isCollapsed} 
        username={username} 
      />
    </div>
  );
};

export default Sidebar;