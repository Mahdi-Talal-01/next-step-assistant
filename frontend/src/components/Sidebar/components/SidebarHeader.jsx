import { Icon } from "@iconify/react";
import '../Sidebar.css';
import logo from '../../../assets/logos/logo.svg';

const SidebarHeader = ({ isCollapsed, onToggle }) => {
  return (
    <div className="sidebar-header">
      <div className="logo">
        <img src={logo} alt="NextStep AI" className="logo-img" />
        {!isCollapsed && <h2>NextStep AI</h2>}
      </div>
      <button
        className="toggle-btn"
        onClick={onToggle}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Icon icon={isCollapsed ? "mdi:chevron-right" : "mdi:chevron-left"} />
      </button>
    </div>
  );
};

export default SidebarHeader;
