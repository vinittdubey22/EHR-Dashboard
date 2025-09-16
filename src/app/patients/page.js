"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Patients() {
  const [q, setQ] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function search() {
    if (!q.trim()) return setErr("Enter a patient name");
    setErr(""); setLoading(true);
    try {
      const data = await proxyRequest(`fhir/Patient?name=${encodeURIComponent(q)}`);
      setPatients(data.entry || []);
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function addPatient(newPatient) {
    try {
      const data = await proxyRequest("fhir/Patient", "POST", newPatient);
      setPatients((prev) => [...prev, { resource: data }]);
    } catch (e) { setErr(e.message || "Failed to add patient"); }
  }

  async function updatePatient(id, updatedData) {
    try {
      const data = await proxyRequest(`fhir/Patient/${id}`, "PUT", updatedData);
      setPatients((prev) =>
        prev.map((p) => (p.resource.id === id ? { resource: data } : p))
      );
    } catch (e) { setErr(e.message || "Failed to update patient"); }
  }

  async function deletePatient(id) {
    try {
      await proxyRequest(`fhir/Patient/${id}`, "DELETE");
      setPatients((prev) => prev.filter((p) => p.resource.id !== id));
    } catch (e) { setErr(e.message || "Failed to delete patient"); }
  }

  return (
    <div>
      <h2>👥 Patients</h2>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input className="input" placeholder="Search by name" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button onClick={search} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>
      {err && <div className="error">{err}</div>}
      {patients.length === 0 && !loading && !err && <div className="empty">No results yet. Try searching.</div>}

      {patients.map((p) => {
        const patient = p.resource;
        return (
          <div key={patient.id} className="card">
            <div style={{ fontWeight: "600" }}>{patient.name?.[0]?.text || "Unnamed Patient"}</div>
            <div>ID: {patient.id}</div>
            <div><b>Allergies:</b> {patient.allergyIntolerance?.map(a => a.code?.text).join(", ") || "None"}</div>
            <div><b>Medications:</b> {patient.medicationRequest?.map(m => m.medicationCodeableConcept?.text).join(", ") || "None"}</div>
            <button onClick={() => updatePatient(patient.id, {/* updatedData */})}>Update</button>
            <button onClick={() => deletePatient(patient.id)}>Delete</button>
          </div>
        );
      })}
      <button onClick={() => addPatient({/* newPatientData */})}>Add Patient</button>
    </div>
  );
}
