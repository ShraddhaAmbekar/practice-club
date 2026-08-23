function CompletedEvents({ events }) {
  const completedEvents = events.filter(
    (event) => event.completed
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h2>
            Completed Events
          </h2>

          <p>
            View all successfully completed
            football club events
          </p>

        </div>

        <div className="completed-count">
          {completedEvents.length} Completed
        </div>

      </div>


      {/* Events */}

      <div className="table-card">

        {completedEvents.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h3>
              No Completed Events
            </h3>

            <p>
              Events marked as completed will
              appear here.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Anchor</th>
                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {completedEvents.map(
                  (event) => (

                    <tr key={event.id}>

                      <td>

                        <strong>
                          {event.name}
                        </strong>

                      </td>

                      <td>
                        {formatDate(event.date)}
                      </td>

                      <td>
                        {event.location || "-"}
                      </td>

                      <td>
                        {event.anchor || "-"}
                      </td>

                      <td>

                        <span className="status-completed">
                          ✓ Completed
                        </span>

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

export default CompletedEvents;