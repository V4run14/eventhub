import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteEvent, fetchEvents } from "../api/eventService";

function EventListPage({ session }) {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ city: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const canManage = useMemo(() => session?.role === "ADMIN", [session]);

  const loadEvents = useCallback(async (cityFilter, categoryFilter) => {
    if (!session?.token) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchEvents(session.token, {
        city: cityFilter,
        category: categoryFilter,
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events", err);
      setError("Unable to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const city = filters.city.trim();
    const category = filters.category.trim();
    loadEvents(city || undefined, category || undefined);
  };

  const handleClearFilters = () => {
    setFilters({ city: "", category: "" });
    loadEvents();
  };

  const handleDelete = async (id) => {
    if (!canManage || !session?.token) {
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) {
      return;
    }
    setStatusMessage("");
    setError("");
    try {
      await deleteEvent(session.token, id);
      setStatusMessage("Event deleted successfully.");
      loadEvents(filters.city.trim() || undefined, filters.category.trim() || undefined);
    } catch (err) {
      console.error("Failed to delete event", err);
      setError("Unable to delete event. Please try again.");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Events</h3>
        {canManage && (
          <Link className="btn btn-primary" to="/events/new">
            + Create Event
          </Link>
        )}
      </div>

      <form className="row g-3 mb-4" onSubmit={handleFilterSubmit}>
        <div className="col-md-4">
          <label className="form-label">City</label>
          <input
            className="form-control"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="e.g. Raleigh"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="e.g. Music"
          />
        </div>
        <div className="col-md-4 d-flex align-items-end gap-2">
          <button type="submit" className="btn btn-outline-primary">Search</button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      </form>

      {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div>Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-muted">No events found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>City</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.category}</td>
                  <td>{event.city}</td>
                  <td>{event.dateTime ? new Date(event.dateTime).toLocaleString() : ""}</td>
                  <td>{event.status}</td>
                  <td>{event.source}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm" role="group">
                      <Link to={`/events/${event.id}`} className="btn btn-outline-secondary">
                        View
                      </Link>
                      {canManage && (
                        <>
                          <Link to={`/events/${event.id}/edit`} className="btn btn-outline-primary">
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(event.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventListPage;