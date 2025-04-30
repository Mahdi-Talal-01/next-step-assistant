import { Icon } from "@iconify/react";

const SidebarHeader = ({ isCollapsed, onToggle }) => {
  return (
    <div className="sidebar-header">
      <h2>Career Assistant</h2>
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
