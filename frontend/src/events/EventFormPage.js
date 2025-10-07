import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createEvent,
  fetchEventById,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  updateEvent,
} from "../api/eventService";

const INITIAL_FORM_STATE = {
  title: "",
  category: "",
  venue: "",
  city: "",
  state: "",
  country: "",
  dateTime: "",
  source: "LOCAL",
  status: "UPCOMING",
  description: "",
  externalId: "",
  priceMin: "",
  priceMax: "",
  capacity: "",
  availableSeats: "",
  imageUrl: "",
};

function EventFormPage({ session }) {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !session?.token) {
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await fetchEventById(session.token, id);
        setForm({
          title: data.title || "",
          category: data.category || "",
          venue: data.venue || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          dateTime: formatForDateTimeLocal(data.dateTime),
          source: data.source || "LOCAL",
          status: data.status || "UPCOMING",
          description: data.description || "",
          externalId: data.externalId || "",
          priceMin: data.priceMin != null ? String(data.priceMin) : "",
          priceMax: data.priceMax != null ? String(data.priceMax) : "",
          capacity: data.capacity != null ? String(data.capacity) : "",
          availableSeats: data.availableSeats != null ? String(data.availableSeats) : "",
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        console.error("Failed to load event", err);
        setError("Unable to load event for editing. It may no longer exist.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dateTime") {
      const sanitized = sanitizeDateTimeInput(value);
      // Keep UI and state in sync with the canonical format.
      if (sanitized !== value) {
        e.target.value = sanitized;
      }
      setForm((prev) => ({ ...prev, dateTime: sanitized }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.token) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload(form);
      const result = isEdit
        ? await updateEvent(session.token, id, payload)
        : await createEvent(session.token, payload);
      navigate(`/events/${result.id}`);
    } catch (err) {
      console.error("Failed to save event", err);
      const responseMessage = err?.response?.data?.message;
      setError(responseMessage || "Unable to save event. Please review the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  const titleText = isEdit ? "Update Event" : "Create Event";

  if (loading) {
    return <div className="card p-4 shadow-sm">Loading event...</div>;
  }

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{titleText}</h3>
        <Link className="btn btn-outline-secondary" to="/events">
          Back to Events
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title *</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category *</label>
          <input
            className="form-control"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Venue *</label>
          <input
            className="form-control"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">City *</label>
          <input
            className="form-control"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">State</label>
          <input
            className="form-control"
            name="state"
            value={form.state}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Country</label>
          <input
            className="form-control"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date &amp; Time *</label>
          <input
            type="datetime-local"
            className="form-control"
            name="dateTime"
            value={form.dateTime}
            onChange={handleChange}
            placeholder="YYYY-MM-DDTHH:MM"
            step="60"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Source *</label>
          <select
            className="form-select"
            name="source"
            value={form.source}
            onChange={handleChange}
            required
          >
            {SOURCE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Status *</label>
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            rows="3"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">External (Ticketmaster) ID</label>
          <input
            className="form-control"
            name="externalId"
            value={form.externalId}
            onChange={handleChange}
            placeholder="e.g. TM-12345"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Minimum Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            name="priceMin"
            value={form.priceMin}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Maximum Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            name="priceMax"
            value={form.priceMax}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Available Seats</label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="availableSeats"
            value={form.availableSeats}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Image URL</label>
          <input
            type="url"
            className="form-control"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : titleText}
          </button>
        </div>
      </form>
    </div>
  );
}

function buildPayload(form) {
  const normalize = (value) => (value && value.trim().length > 0 ? value.trim() : null);
  const numericOrNull = (value, parser) => {
    if (value === "" || value == null) {
      return null;
    }
    const parsed = parser(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  return {
    title: form.title.trim(),
    category: form.category.trim(),
    venue: form.venue.trim(),
    city: form.city.trim(),
    state: normalize(form.state),
    country: normalize(form.country),
    dateTime: normalizeDateTime(form.dateTime),
    source: form.source,
    status: form.status,
    description: normalize(form.description),
    externalId: normalize(form.externalId),
    priceMin: numericOrNull(form.priceMin, parseFloat),
    priceMax: numericOrNull(form.priceMax, parseFloat),
    capacity: numericOrNull(form.capacity, parseInt),
    availableSeats: numericOrNull(form.availableSeats, parseInt),
    imageUrl: normalize(form.imageUrl),
  };
}

function sanitizeDateTimeInput(raw) {
  if (!raw) {
    return "";
  }
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.replace(" ", "T");
  }
  const shortMatch = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (shortMatch) {
    const [, month, day, year, hours, minutes] = shortMatch;
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  return trimmed.replace(" ", "T");
}

function normalizeDateTime(value) {
  const sanitized = sanitizeDateTimeInput(value);
  if (!sanitized) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(sanitized)) {
    return `${sanitized}:00`;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(sanitized)) {
    return sanitized;
  }
  return sanitized;
}

function formatForDateTimeLocal(raw) {
  if (!raw) {
    return "";
  }
  const sanitized = sanitizeDateTimeInput(raw);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(sanitized)) {
    return sanitized;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(sanitized)) {
    return sanitized.substring(0, 16);
  }
  return sanitized.substring(0, 16);
}

export default EventFormPage;