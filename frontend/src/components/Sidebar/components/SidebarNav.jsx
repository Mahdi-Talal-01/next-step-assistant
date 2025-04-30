import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
const SidebarNav = ({ links, isCollapsed }) => {
  return (
    <nav className="sidebar-nav">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {/* <Icon icon={link.icon} className="icon" /> */}
          {!isCollapsed && <span className="label">{link.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;
