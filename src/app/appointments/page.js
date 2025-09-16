"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [newPatientId, setNewPatientId] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  async function loadAppointments() {
    setLoading(true); setErr("");
    try {
      const data = await proxyRequest("fhir/Appointment");
      setAppointments(data.entry || []);
    } catch (e) { setErr(e.message || "Failed to load"); }
    finally { setLoading(false); }
  }

  async function bookAppointment() {
    if (!newPatientId || !newStart || !newEnd) return setErr("Fill all fields");
    setErr(""); setLoading(true);
    try {
      const newAppointment = {
        participant: [{ actor: { reference: `Patient/${newPatientId}` } }],
        start: newStart,
        end: newEnd
      };
      const data = await proxyRequest("fhir/Appointment", "POST", newAppointment);
      setAppointments(prev => [...prev, { resource: data }]);
      setNewPatientId(""); setNewStart(""); setNewEnd("");
    } catch (e) { setErr(e.message || "Failed to book"); }
    finally { setLoading(false); }
  }

  async function rescheduleAppointment(id) {
    const start = prompt("New start time");
    const end = prompt("New end time");
    if (!start || !end) return;
    try {
      const data = await proxyRequest(`fhir/Appointment/${id}`, "PUT", { start, end });
      setAppointments(prev => prev.map(a => a.resource.id === id ? { resource: data } : a));
    } catch (e) { setErr(e.message || "Failed to reschedule"); }
  }

  async function cancelAppointment(id) {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await proxyRequest(`fhir/Appointment/${id}`, "DELETE");
      setAppointments(prev => prev.filter(a => a.resource.id !== id));
    } catch (e) { setErr(e.message || "Failed to cancel"); }
  }

  return (
    <div>
      <h2>📅 Appointments</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input className="input" placeholder="Patient ID" value={newPatientId} onChange={e => setNewPatientId(e.target.value)} />
        <input className="input" placeholder="Start time" value={newStart} onChange={e => setNewStart(e.target.value)} />
        <input className="input" placeholder="End time" value={newEnd} onChange={e => setNewEnd(e.target.value)} />
        <button onClick={bookAppointment} disabled={loading}>{loading ? "Booking..." : "Book"}</button>
      </div>

      <button onClick={loadAppointments} disabled={loading}>{loading ? "Loading..." : "Load Appointments"}</button>

      {err && <div className="error">{err}</div>}
      {appointments.length === 0 && !loading && !err && <div className="empty">No appointments found.</div>}

      {appointments.map(a => {
        const appt = a.resource;
        return (
          <div key={appt.id} className="card">
            <div><b>ID:</b> {appt.id}</div>
            <div><b>Start:</b> {appt.start}</div>
            <div><b>End:</b> {appt.end}</div>
            <div><b>Status:</b> {appt.status}</div>
            <button onClick={() => rescheduleAppointment(appt.id)}>Reschedule</button>
            <button onClick={() => cancelAppointment(appt.id)}>Cancel</button>
          </div>
        );
      })}
    </div>
  );
}
