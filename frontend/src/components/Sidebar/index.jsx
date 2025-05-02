import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSidebarState } from './hooks/useSidebarState';
import { navLinks } from '../../constants/navLinks';
import SidebarNav from './components/SidebarNav';
import SidebarHeader from './components/SidebarHeader';
import UserProfile from './components/UserProfile';

import './Sidebar.css';
const Sidebar = ({ username = "User Name" }) => {
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };

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
      
      <div className="sidebar-footer">
        <div className="logout-container">
          {isCollapsed ? (
            <button className="logout-icon-button" onClick={handleLogout} title="Logout">
              <Icon icon="mdi:logout" />
            </button>
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              <Icon icon="mdi:logout" className="logout-icon" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;