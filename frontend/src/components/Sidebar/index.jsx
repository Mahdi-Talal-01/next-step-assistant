import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useSidebarState } from "./hooks/useSidebarState";
import { navLinks } from "../../constants/navLinks";
import SidebarNav from "./components/SidebarNav";
import SidebarHeader from "./components/SidebarHeader";
import UserProfile from "./components/UserProfile";

import "./Sidebar.css";

/**
 * Sidebar component for the application
 * @param {Object} props - Component props
 * @param {string} props.username - Username to display
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed (controlled from parent)
 * @param {function} props.onToggle - Function to toggle sidebar state
 */
const Sidebar = ({ username = "User Name", isCollapsed, onToggle }) => {
  // Use internal state if props are not provided
  const sidebarState = useSidebarState();
  const isSidebarCollapsed =
    isCollapsed !== undefined ? isCollapsed : sidebarState.isCollapsed;
  const toggleSidebar = onToggle || sidebarState.toggleSidebar;

  const navigate = useNavigate();

  // Navigate to the landing page for logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <SidebarHeader
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      <SidebarNav links={navLinks} isCollapsed={isSidebarCollapsed} />

      <div className="sidebar-footer">
        <div className="logout-container">
          {isSidebarCollapsed ? (
            <button
              className="logout-icon-button"
              onClick={handleLogout}
              title="Logout"
            >
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
