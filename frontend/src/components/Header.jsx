function Header({ title, subtitle }) {
  return (
    <header className="header">

      <div className="header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-right">

        <button className="notification-btn">
          🔔
        </button>

        <div className="header-profile">
          <div className="header-avatar">
            M
          </div>

          <div className="header-user-info">
            <strong>Management</strong>
            <span>Administrator</span>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Header;