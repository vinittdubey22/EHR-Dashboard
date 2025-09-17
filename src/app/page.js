"use client";

import { useEffect, useState } from "react";
import { proxyRequest } from "../lib/apiClient";

export default function Home() {
  const [patientsCount, setPatientsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [observationsCount, setObservationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadCounts() {
      setLoading(true);
      setErr("");
      try {
        const patients = await proxyRequest("Patient");
        const appointments = await proxyRequest("Appointment");
        const observations = await proxyRequest("Observation");
        setPatientsCount(patients.entry?.length || 0);
        setAppointmentsCount(appointments.entry?.length || 0);
        setObservationsCount(observations.entry?.length || 0);
      } catch (e) {
        setErr(e.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadCounts();
  }, []);

  return (
    <div className="page-container-outer">
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Dashboard</h1>
      
      {err && <div className="error">{err}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h3>👥 Total Patients</h3>
          <p className="stat-number">{loading ? "..." : patientsCount}</p>
        </div>
        <div className="card">
          <h3>📅 Upcoming Appointments</h3>
          <p className="stat-number">{loading ? "..." : appointmentsCount}</p>
        </div>
        <div className="card">
          <h3>🧪 Observations</h3>
          <p className="stat-number">{loading ? "..." : observationsCount}</p>
        </div>
      </div>

      <div className="quick-actions" style={{ marginTop: "2rem" }}>
        <a href="/patients"><button className="quick-primary">Add Patient</button></a>
        <a href="/appointments"><button className="quick-primary">Book Appointment</button></a>
        <a href="/clinical"><button className="quick-warning">Add Observation</button></a>
      </div>
    </div>
  );
}
