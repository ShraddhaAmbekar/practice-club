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

  if (!loggedInUser) {
    return <Login onLogin={handleLogin} />;
  }

  // ==========================================
  // MANAGEMENT / ADMIN
  // ==========================================

  if (loggedInUser.role === "admin") {
    return (
      <ManagementDashboard
        user={loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // DATA ENTRY
  // ==========================================

  if (loggedInUser.role === "data_entry") {
    return (
      <DataEntryDashboard
        user={loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // ANCHOR
  // ==========================================

  if (loggedInUser.role === "anchor") {
    return (
      <AnchorDashboard
        user={loggedInUser}
        users={[]}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}

export default App;