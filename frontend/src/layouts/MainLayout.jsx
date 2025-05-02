import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useResponsiveLayout } from "../hooks/useResponsivelayout";
import "./MainLayout.css";

const MainLayout = () => {
  const { isMobile, isSidebarOpen, toggleSidebar } = useResponsiveLayout();

  return (
    <div className="app-container">
      <Sidebar isCollapsed={isSidebarOpen} onToggle={toggleSidebar} />

      <div
        className={`main-container ${isSidebarOpen ? "sidebar-collapsed" : ""}`}
      >
        <Navbar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          role="presentation"
        />
      )}
    </div>
  );
};

export default MainLayout;
