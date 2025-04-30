import { navLinks } from "../../constants/navLinks";
import { useSidebarState } from "./hooks/useSidebarState";
import SidebarHeader from "./components/SidebarHeader";
import SidebarNav from "./components/SidebarNav";
import UserProfile from "./components/UserProfile";

const Sidebar = ({ username = "User Name" }) => {
  const { isCollapsed, toggleSidebar } = useSidebarState();

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      <SidebarNav links={navLinks} isCollapsed={isCollapsed} />

      <UserProfile isCollapsed={isCollapsed} username={username} />
    </div>
  );
};

export default Sidebar;
