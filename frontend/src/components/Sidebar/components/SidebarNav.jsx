import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import '../Sidebar.css';

const SidebarNav = ({ links, isCollapsed }) => {
  const location = useLocation();

  // Function to determine if a link should be active
  const isLinkActive = (path) => {
    // For root app path, only make it active if we're exactly at /app
    if (path === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/';
    }
    // For other paths, check if the current location starts with that path
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sidebar-nav">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={() => 
            `sidebar-link ${isLinkActive(link.path) ? "active" : ""}`
          }
        >
          <Icon icon={link.icon} className="icon" />
          {!isCollapsed && <span className="label">{link.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;
