"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadAppointments() {
    setLoading(true); setErr("");
    try {
      const data = await proxyRequest("fhir/Appointment");
      setAppointments(data.entry || []);
    } catch (e) { setErr(e.message || "Failed to load appointments"); }
    finally { setLoading(false); }
  }

  async function bookAppointment(newAppointment) {
    try {
      const data = await proxyRequest("fhir/Appointment", "POST", newAppointment);
      setAppointments((prev) => [...prev, { resource: data }]);
    } catch (e) { setErr(e.message || "Failed to book appointment"); }
  }

  async function rescheduleAppointment(id, updatedData) {
    try {
      const data = await proxyRequest(`fhir/Appointment/${id}`, "PUT", updatedData);
      setAppointments((prev) =>
        prev.map((a) => (a.resource.id === id ? { resource: data } : a))
      );
    } catch (e) { setErr(e.message || "Failed to reschedule"); }
  }

  async function cancelAppointment(id) {
    try {
      await proxyRequest(`fhir/Appointment/${id}`, "DELETE");
      setAppointments((prev) => prev.filter((a) => a.resource.id !== id));
    } catch (e) { setErr(e.message || "Failed to cancel"); }
  }

  return (
    <div>
      <h2>📅 Appointments</h2>
      <button onClick={loadAppointments} disabled={loading}>{loading ? "Loading..." : "Load Appointments"}</button>
      {err && <div className="error">{err}</div>}
      {appointments.length === 0 && !loading && !err && <div className="empty">No appointments found.</div>}
      {appointments.map((a) => (
        <div key={a.resource.id} className="card">
          <div><b>ID:</b> {a.resource.id}</div>
          <div><b>Status:</b> {a.resource.status}</div>
          <div><b>Start:</b> {a.resource.start}</div>
          <div><b>End:</b> {a.resource.end}</div>
          <button onClick={() => rescheduleAppointment(a.resource.id, {/* updatedData */})}>Reschedule</button>
          <button onClick={() => cancelAppointment(a.resource.id)}>Cancel</button>
        </div>
      ))}
      <button onClick={() => bookAppointment({/* newAppointmentData */})}>Book Appointment</button>
    </div>
  );
}
