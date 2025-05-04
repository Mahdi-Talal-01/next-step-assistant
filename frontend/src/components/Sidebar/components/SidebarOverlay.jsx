import '../Sidebar.css';
const SidebarOverlay = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose} role="presentation" />
  );
};

export default SidebarOverlay;
