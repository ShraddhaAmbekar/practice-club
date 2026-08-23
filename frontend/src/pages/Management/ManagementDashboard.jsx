import { useEffect, useState } from "react";
import PlayerForm from "../DataEntry/PlayerForm";

function ManagementDashboard({ user, onLogout }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] =
    useState(null);

  const [editingPlayer, setEditingPlayer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // GET ALL PLAYERS
  // ==========================================

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/players",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Players fetch करताना error आला."
        );
      }

      setPlayers(data);
    } catch (error) {
      console.error(
        "Fetch players error:",
        error
      );

      setError(
        error.message ||
          "Players fetch करताना error आला."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET SINGLE PLAYER
  // ==========================================

  const handleViewPlayer = async (playerId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Login session सापडले नाही."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/players/${playerId}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Player माहिती fetch करता आली नाही."
        );
      }

      setSelectedPlayer(data);
    } catch (error) {
      console.error(
        "View player error:",
        error
      );

      setError(
        error.message ||
          "Player माहिती fetch करताना error आला."
      );
    } finally {
      setDetailsLoading(false);
    }
  };
const handleDeletePlayer = async (playerId) => {
  const confirmed = window.confirm(
    "हा Player कायमचा delete करायचा आहे का?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    const token =
      localStorage.getItem("token");

    if (!token) {
      setError(
        "Login session सापडले नाही. कृपया पुन्हा Login करा."
      );
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/players/${playerId}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Player delete करताना error आला."
      );
    }

    console.log(
      "Player deleted:",
      data
    );

    // Remove deleted player from list
    setPlayers((prevPlayers) =>
      prevPlayers.filter(
        (player) =>
          player._id !== playerId
      )
    );

    // Close details if deleted player
    if (
      selectedPlayer?._id === playerId
    ) {
      setSelectedPlayer(null);
    }

    setError("");

    alert(
      "Player यशस्वीपणे delete झाला."
    );

  } catch (error) {
    console.error(
      "Delete player error:",
      error
    );

    setError(
      error.message ||
        "Player delete करताना error आला."
    );
  }
};
  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CLOSE DETAILS
  // ==========================================

  const closeDetails = () => {
    setSelectedPlayer(null);
    setError("");
  };

  // ==========================================
  // EDIT PLAYER
  // ==========================================

  if (editingPlayer) {
    return (
      <div className="management-dashboard">

        {/* Header */}

        <div className="dashboard-header">

          <div>
            <h1>
              Edit Player
            </h1>

            <p>
              {editingPlayer.fullName}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

        {/* Player Form */}

        <PlayerForm
          player={editingPlayer}

          onSave={(updatedPlayer) => {
            console.log(
              "Updated player:",
              updatedPlayer
            );

            // Update player in list
            setPlayers((prevPlayers) =>
              prevPlayers.map((player) =>
                player._id ===
                updatedPlayer._id
                  ? updatedPlayer
                  : player
              )
            );

            // Update selected player
            setSelectedPlayer(
              updatedPlayer
            );

            // Close edit mode
            setEditingPlayer(null);
          }}

          onCancel={() => {
            setEditingPlayer(null);
          }}
        />

      </div>
    );
  }

  // ==========================================
  // PLAYER DETAILS VIEW
  // ==========================================

  if (selectedPlayer) {
    return (
      <div className="management-dashboard">

        {/* Header */}

        <div className="dashboard-header">

          <div>
            <h1>
              Player Details
            </h1>

            <p>
              {selectedPlayer.fullName}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

        {/* Player Details */}

        <div className="player-details">

          {/* Photo */}

          <div className="details-photo-section">

            {selectedPlayer.photo ? (
              <img
                src={selectedPlayer.photo}
                alt={
                  selectedPlayer.fullName
                }
                className="player-detail-photo"
              />
            ) : (
              <div className="no-photo">
                ⚽
              </div>
            )}

          </div>

          {/* Personal Information */}

          <div className="details-section">

            <h2>
              वैयक्तिक माहिती
            </h2>

            <div className="details-grid">

              <Detail
                label="पूर्ण नाव"
                value={
                  selectedPlayer.fullName
                }
              />

              <Detail
                label="टोपण नाव"
                value={
                  selectedPlayer.nickname
                }
              />

              <Detail
                label="जन्मतारीख"
                value={formatDate(
                  selectedPlayer.birthDate
                )}
              />

              <Detail
                label="WhatsApp Number"
                value={
                  selectedPlayer.whatsappNumber
                }
              />

              <Detail
                label="Alternate Contact Number"
                value={
                  selectedPlayer.alternateContactNumber
                }
              />

              <Detail
                label="आहार प्रकार"
                value={
                  selectedPlayer.foodPreference
                }
              />

            </div>

          </div>

          {/* Football Information */}

          <div className="details-section">

            <h2>
              Football माहिती
            </h2>

            <div className="details-grid">

              <Detail
                label="Football सुरू केलेले वर्ष"
                value={
                  selectedPlayer.footballStartedYear
                }
              />

              <Detail
                label="Practice Club प्रवेश वर्ष"
                value={
                  selectedPlayer.practiceClubFromYear
                }
              />

              <Detail
                label="Practice Club मधील शेवटचे वर्ष"
                value={
                  selectedPlayer.practiceClubToYear
                }
              />

              <Detail
                label="सध्या Practice Club मध्ये"
                value={
                  selectedPlayer.currentlyPlayingAtPracticeClub
                    ? "होय"
                    : "नाही"
                }
              />

              <Detail
                label="खेळातील प्रमुख स्थान"
                value={
                  selectedPlayer.playingPosition
                }
              />

            </div>

          </div>

          {/* Competitions */}

          <div className="details-section">

            <h2>
              आठवणीतील उल्लेखनीय स्पर्धा
            </h2>

            {selectedPlayer
              .memorableCompetitions
              ?.length > 0 ? (

              <ul>
                {selectedPlayer.memorableCompetitions.map(
                  (
                    competition,
                    index
                  ) => (
                    <li key={index}>
                      {competition}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>
                कोणतीही माहिती नाही.
              </p>
            )}

          </div>

          {/* Relatives */}

          <div className="details-section">

            <h2>
              Practice Club मधील नातेवाईक
            </h2>

            <p>
              {selectedPlayer
                .hasRelativesInPracticeClub
                ? "होय"
                : "नाही"}
            </p>

            {selectedPlayer
              .relativesInPracticeClub
              ?.length > 0 && (

              <ul>

                {selectedPlayer.relativesInPracticeClub.map(
                  (
                    relative,
                    index
                  ) => (

                    <li key={index}>

                      <strong>
                        {relative.name}
                      </strong>

                      {" - "}

                      {relative.relation}

                    </li>

                  )
                )}

              </ul>

            )}

          </div>

          {/* Record Information */}

          <div className="details-section">

            <h2>
              Record Information
            </h2>

            <div className="details-grid">

              <Detail
                label="Created By"
                value={
                  selectedPlayer
                    .createdBy
                    ?.name || "-"
                }
              />

              <Detail
                label="Username"
                value={
                  selectedPlayer
                    .createdBy
                    ?.username || "-"
                }
              />

              <Detail
                label="Created At"
                value={formatDate(
                  selectedPlayer.createdAt
                )}
              />

            </div>

          </div>

        </div>

        {/* Actions */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >

          <button
            onClick={() =>
              setEditingPlayer(
                selectedPlayer
              )
            }
            className="edit-btn"
          >
            ✏️ Edit Player
          </button>
<button
  onClick={() =>
    handleDeletePlayer(
      selectedPlayer._id
    )
  }
  className="delete-btn"
>
  🗑️ Delete Player
</button>
          <button
            onClick={closeDetails}
            className="back-btn"
          >
            ← Back to Players
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // MANAGEMENT PLAYER LIST
  // ==========================================

  return (
    <div className="management-dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>

          <h1>
            Management Dashboard
          </h1>

          <p>
            Welcome, {user.name}
          </p>

        </div>

        <button
          onClick={onLogout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

      {/* Summary */}

      <div className="dashboard-summary">

        <div className="summary-card">

          <h3>
            Total Players
          </h3>

          <strong>
            {players.length}
          </strong>

        </div>

      </div>

      {/* Players */}

      <div className="players-section">

        <div className="section-header">

          <div>

            <h2>
              Players
            </h2>

            <p>
              नोंद झालेल्या सर्व खेळाडूंची माहिती
            </p>

          </div>

          <button
            onClick={fetchPlayers}
            className="refresh-btn"
          >
            Refresh
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <p>
            Players माहिती load होत आहे...
          </p>
        )}

        {detailsLoading && (
          <p>
            Player माहिती load होत आहे...
          </p>
        )}

        {/* Error */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          players.length === 0 && (

            <div className="empty-message">
              अजून कोणत्याही Player ची माहिती
              नोंद झालेली नाही.
            </div>

          )}

        {/* Table */}

        {!loading &&
          !error &&
          players.length > 0 && (

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      No.
                    </th>

                    <th>
                      Player Name
                    </th>

                    <th>
                      Created By
                    </th>

                    <th>
                      Created At
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {players.map(
                    (
                      player,
                      index
                    ) => (

                      <tr
                        key={player._id}
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {player.fullName}
                        </td>

                        <td>
                          {player.createdBy?.name ||
                            "-"}
                        </td>

                        <td>
                          {formatDate(
                            player.createdAt
                          )}
                        </td>

                        <td>

                          <button
                            className="view-btn"
                            onClick={() =>
                              handleViewPlayer(
                                player._id
                              )
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>
  );
}

// ==========================================
// DETAIL COMPONENT
// ==========================================

function Detail({
  label,
  value,
}) {
  return (
    <div className="detail-item">

      <span className="detail-label">
        {label}
      </span>

      <strong className="detail-value">
        {value || "-"}
      </strong>

    </div>
  );
}

export default ManagementDashboard;