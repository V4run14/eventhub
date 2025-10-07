import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../api/eventService";

function EventDetailsPage({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!session?.token || !id) {
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await fetchEventById(session.token, id);
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event", err);
        setError("Unable to load event details. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, session]);

  if (loading) {
    return <div className="card p-4 shadow-sm">Loading event...</div>;
  }

  if (error) {
    return (
      <div className="card p-4 shadow-sm">
        <div className="alert alert-danger mb-3">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="card p-4 shadow-sm">
        <div className="text-muted">Event not found.</div>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  const metaRows = [
    { label: "Venue", value: event.venue },
    { label: "City", value: event.city },
    { label: "State", value: event.state },
    { label: "Country", value: event.country },
    { label: "Date & Time", value: event.dateTime ? new Date(event.dateTime).toLocaleString() : "" },
    { label: "Status", value: event.status },
    { label: "Source", value: event.source },
    { label: "Ticketmaster ID", value: event.externalId },
    { label: "Created By", value: event.createdBy },
    { label: "Price Range", value: formatPriceRange(event.priceMin, event.priceMax) },
    { label: "Capacity", value: formatNumber(event.capacity) },
    { label: "Available Seats", value: formatNumber(event.availableSeats) },
  ];

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{event.title}</h3>
        <Link className="btn btn-outline-secondary" to="/events">
          Back to Events
        </Link>
      </div>

      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="img-fluid rounded mb-3"
          style={{ maxHeight: "320px", objectFit: "cover" }}
        />
      )}

      <p className="lead">{event.description || "No description provided."}</p>

      <div className="row">
        {metaRows.map(({ label, value }) => (
          value ? (
            <div className="col-md-6 mb-3" key={label}>
              <strong>{label}:</strong>
              <div>{value}</div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}

function formatPriceRange(min, max) {
  if (min == null && max == null) {
    return "";
  }
  if (min != null && max != null) {
    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  }
  const value = min != null ? min : max;
  return value != null ? `$${value.toFixed(2)}` : "";
}

function formatNumber(value) {
  if (value == null) {
    return "";
  }
  return Number(value).toLocaleString();
}

export default EventDetailsPage;