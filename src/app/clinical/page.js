"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Clinical() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadPatients() {
    setLoading(true); setErr("");
    try {
      const data = await proxyRequest("fhir/Patient");
      setPatients(data.entry || []);
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function addVitals(id) {
    const bp = prompt("Enter blood pressure");
    const hr = prompt("Enter heart rate");
    if (!bp || !hr) return;
    try {
      await proxyRequest("fhir/Observation", "POST", { subject: { reference: `Patient/${id}` }, bp, hr });
      alert("Vitals added");
    } catch (e) { setErr(e.message || "Failed to add vitals"); }
  }

  async function addClinicalNote(id) {
    const note = prompt("Enter clinical note");
    if (!note) return;
    try {
      await proxyRequest("fhir/Observation", "POST", { subject: { reference: `Patient/${id}` }, note });
      alert("Note added");
    } catch (e) { setErr(e.message || "Failed to add note"); }
  }

  return (
    <div>
      <h2>🩺 Clinical Operations</h2>

      <button onClick={loadPatients} disabled={loading}>{loading ? "Loading..." : "Load Patients"}</button>

      {err && <div className="error">{err}</div>}
      {patients.length === 0 && !loading && !err && <div className="empty">No patients found.</div>}

      {patients.map(p => {
        const patient = p.resource;
        return (
          <div key={patient.id} className="card">
            <div><b>Name:</b> {patient.name?.[0]?.text || "Unnamed"}</div>
            <div><b>ID:</b> {patient.id}</div>
            <button onClick={() => addVitals(patient.id)}>Add Vitals</button>
            <button onClick={() => addClinicalNote(patient.id)}>Add Note</button>
          </div>
        );
      })}
    </div>
  );
}
