function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "users",
      label: "User Master",
      icon: "👥",
    },
    {
      id: "anchors",
      label: "Anchor Management",
      icon: "🎤",
    },
    {
      id: "events",
      label: "Event Management",
      icon: "📅",
    },
    {
      id: "completed",
      label: "Completed Events",
      icon: "✓",
    },
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          FC
        </div>

        <div>
          <h2>Football Club</h2>
          <p>Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="menu-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activePage === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(item.id)
            }
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </button>
        ))}

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <div className="admin-profile">

          <div className="admin-avatar">
            M
          </div>

          <div>
            <strong>
              Management
            </strong>

            <span>
              Administrator
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;