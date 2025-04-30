import React from "react";
import { Icon } from "@iconify/react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="page-title">Dashboard</h1>
      </div>
      <div className="navbar-right">
        <div className="notification-wrapper">
          <Icon icon="mdi:bell-outline" className="nav-icon" />
          <span className="notification-badge">3</span>
        </div>
        <div className="settings-wrapper">
          <Icon icon="mdi:cog" className="nav-icon" />
        </div>
        <div className="user-profile">
          <span className="user-name">John Doe</span>
          <Icon icon="mdi:account" className="nav-icon user-icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 