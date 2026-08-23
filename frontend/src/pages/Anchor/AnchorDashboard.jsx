import { useEffect, useState } from "react";

function AnchorDashboard({ user, onLogout }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [hiddenPlayers, setHiddenPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  // =========================
  // GET PLAYERS
  // =========================

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/players",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setPlayers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW PLAYER
  // =========================

  const handleViewPlayer = async (id) => {
    try {
      setDetailsLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/players/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSelectedPlayer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================
  // HIDE PLAYER
  // =========================

  const toggleHidePlayer = (id) => {
    setHiddenPlayers((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // =========================
  // SORT BY JOINING YEAR
  // =========================

  const visiblePlayers = players
    .filter(
      (player) =>
        !hiddenPlayers.includes(player._id)
    )
    .sort((a, b) => {
      const yearA =
        Number(a.practiceClubFromYear) || 9999;
      const yearB =
        Number(b.practiceClubFromYear) || 9999;

      if (yearA !== yearB)
        return yearA - yearB;

      return a.fullName.localeCompare(
        b.fullName
      );
    });

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

  // =========================
  // PLAYER DETAILS
  // =========================

  if (selectedPlayer) {
    return (
      <div className="management-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Player Details</h1>
            <p>{selectedPlayer.fullName}</p>
          </div>

          <button
            onClick={onLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>

        <div className="player-details">
          <div className="details-photo-section">
            {selectedPlayer.photo ? (
              <img
                src={selectedPlayer.photo}
                alt={selectedPlayer.fullName}
                className="player-detail-photo"
              />
            ) : (
              <div className="no-photo">
                ⚽
              </div>
            )}
          </div>

          <div className="details-section">
            <h2>
              वैयक्तिक माहिती
            </h2>

            <div className="details-grid">
              <Detail
                label="पूर्ण नाव"
                value={selectedPlayer.fullName}
              />
              <Detail
                label="टोपण नाव"
                value={selectedPlayer.nickname}
              />
              <Detail
                label="जन्मतारीख"
                value={formatDate(
                  selectedPlayer.birthDate
                )}
              />
              <Detail
                label="WhatsApp Number"
                value={selectedPlayer.whatsappNumber}
              />
              <Detail
                label="Alternate Contact"
                value={selectedPlayer.alternateContactNumber}
              />
              <Detail
                label="आहार प्रकार"
                value={selectedPlayer.foodPreference}
              />
            </div>
          </div>

          <div className="details-section">
            <h2>
              Football माहिती
            </h2>

            <div className="details-grid">
              <Detail
                label="Football सुरू केलेले वर्ष"
                value={selectedPlayer.footballStartedYear}
              />
              <Detail
                label="Practice Club प्रवेश वर्ष"
                value={selectedPlayer.practiceClubFromYear}
              />
              <Detail
                label="Practice Club मधील शेवटचे वर्ष"
                value={selectedPlayer.practiceClubToYear}
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
                value={selectedPlayer.playingPosition}
              />
            </div>
          </div>

          <div className="details-section">
            <h2>
              आठवणीतील उल्लेखनीय स्पर्धा
            </h2>

            {selectedPlayer.memorableCompetitions
              ?.length ? (
              <ul>
                {selectedPlayer.memorableCompetitions.map(
                  (
                    item,
                    index
                  ) => (
                    <li key={index}>
                      {item}
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

          <div className="details-section">
            <h2>
              Practice Club मधील नातेवाईक
            </h2>

            <p>
              {selectedPlayer.hasRelativesInPracticeClub
                ? "होय"
                : "नाही"}
            </p>

            {selectedPlayer.relativesInPracticeClub
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
                      </strong>{" "}
                      -{" "}
                      {relative.relation}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={() =>
            setSelectedPlayer(null)
          }
          className="back-btn"
        >
          ← Back to Players
        </button>
      </div>
    );
  }

  // =========================
  // MAIN DASHBOARD
  // =========================

  return (
    <div className="management-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>
            Anchor Dashboard
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

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>
            Visible Players
          </h3>
          <strong>
            {visiblePlayers.length}
          </strong>
        </div>
      </div>

      <div className="players-section">
        <div className="section-header">
          <div>
            <h2>
              Players
            </h2>
            <p>
              Joining Year नुसार क्रमवारी
            </p>
          </div>

          <button
            onClick={fetchPlayers}
            className="refresh-btn"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <p>
            माहिती load होत आहे...
          </p>
        )}

        {detailsLoading && (
          <p>
            Player माहिती load होत आहे...
          </p>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading &&
          visiblePlayers.length === 0 && (
            <div className="empty-message">
              कोणताही Player उपलब्ध नाही.
            </div>
          )}

        {!loading &&
          visiblePlayers.length > 0 && (
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
                      Joining Year
                    </th>
                    <th>
                      Hide
                    </th>
                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiblePlayers.map(
                    (
                      player,
                      index
                    ) => (
                      <tr key={player._id}>
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {player.fullName}
                        </td>

                        <td>
                          {player.practiceClubFromYear ||
                            "-"}
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            onChange={() =>
                              toggleHidePlayer(
                                player._id
                              )
                            }
                          />
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

// =========================
// DETAIL COMPONENT
// =========================

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

export default AnchorDashboard;