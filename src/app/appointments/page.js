"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await proxyRequest("fhir/Appointment");
      setAppointments(data.entry || []);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ animation: "fadeIn 0.6s ease-in-out" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>📅 Appointments</h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Load and view scheduled appointments.
      </p>

      <button onClick={load} disabled={loading} style={{ marginBottom: "1.5rem" }}>
        {loading ? "Loading..." : "Load Appointments"}
      </button>

      {appointments.length === 0 && !loading && (
        <p style={{ color: "#888" }}>No appointments found.</p>
      )}

      {appointments.map((a, i) => {
        const appt = a.resource;
        return (
          <div
            className="card"
            key={appt.id}
            style={{
              animation: "fadeUp 0.4s ease",
              animationDelay: `${i * 0.05}s`
            }}
          >
            <p><strong>ID:</strong> {appt.id}</p>
            <p><strong>Status:</strong> {appt.status}</p>
            {appt.start && <p><strong>Start:</strong> {appt.start}</p>}
            {appt.end && <p><strong>End:</strong> {appt.end}</p>}
          </div>
        );
      })}
    </div>
  );
}
