const UserProfile = ({ isCollapsed, username }) => {
  return (
    <div className="sidebar-footer">
      <div className="user-profile">
        <div className="avatar">
          <Icon icon="mdi:account" />
        </div>
        {!isCollapsed && <span className="username">{username}</span>}
      </div>
    </div>
  );
};

export default UserProfile;
