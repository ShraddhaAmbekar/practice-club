import { useState } from "react";
import PlayerForm from "./PlayerForm";

function DataEntryDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  // ==========================================
  // PLAYER FORM
  // ==========================================

  if (activePage === "player-form") {
    return (
      <div>
        <div
          style={{
            padding: "15px 25px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setActivePage("dashboard")}
          >
            ← Dashboard वर जा
          </button>

          <button onClick={onLogout}>
            Logout
          </button>
        </div>

        <PlayerForm
  player={editingPlayer}
  onSave={handlePlayerUpdated}
  onCancel={() => setEditingPlayer(null)}
/>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>
        Data Entry Dashboard
      </h1>

      <p>
        Welcome, {user.name}
      </p>

      <p>
        येथे Player ची माहिती भरता येईल.
      </p>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            setActivePage("player-form")
          }
          style={{
            padding: "14px 22px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          + Player माहिती भरा
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <button onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default DataEntryDashboard;