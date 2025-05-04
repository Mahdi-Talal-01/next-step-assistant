import { useState } from "react";

export const useSidebarState = (initialState = false) => {
  const [isCollapsed, setIsCollapsed] = useState(initialState);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return {
    isCollapsed,
    toggleSidebar,
  };
};
