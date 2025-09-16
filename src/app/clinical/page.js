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

  async function addVitals(patientId, vitals) {
    await proxyRequest("fhir/Observation", "POST", {
      subject: { reference: `Patient/${patientId}` },
      ...vitals
    });
  }

  async function addClinicalNote(patientId, note) {
    await proxyRequest("fhir/Observation", "POST", {
      subject: { reference: `Patient/${patientId}` },
      note
    });
  }

  return (
    <div>
      <h2>🩺 Clinical Operations</h2>
      <button onClick={loadPatients} disabled={loading}>{loading ? "Loading..." : "Load Patients"}</button>
      {err && <div className="error">{err}</div>}
      {patients.length === 0 && !loading && !err && <div className="empty">No patients found.</div>}
      {patients.map((p) => {
        const patient = p.resource;
        return (
          <div key={patient.id} className="card">
            <div style={{ fontWeight: "600" }}>{patient.name?.[0]?.text || "Unnamed Patient"}</div>
            <button onClick={() => addVitals(patient.id, {/* vitals object */})}>Add Vitals</button>
            <button onClick={() => addClinicalNote(patient.id, "Note text")}>Add Clinical Note</button>
          </div>
        );
      })}
    </div>
  );
}
