import { useState } from "react";
import Login from "./pages/Login";

import ManagementDashboard from "./pages/Management/ManagementDashboard";
import DataEntryDashboard from "./pages/DataEntry/DataEntryDashboard";
import AnchorDashboard from "./pages/Anchor/AnchorDashboard";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("token");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  if (!loggedInUser) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // ==========================================
  // MANAGEMENT / ADMIN
  // ==========================================

  if (loggedInUser.role === "admin") {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <ManagementDashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // ==========================================
  // DATA ENTRY
  // ==========================================

  if (loggedInUser.role === "data_entry") {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <DataEntryDashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // ==========================================
  // ANCHOR
  // ==========================================

  if (loggedInUser.role === "anchor") {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <AnchorDashboard
          user={loggedInUser}
          users={[]}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return null;
}

export default App;