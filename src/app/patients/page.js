"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Patients() {
  const [q, setQ] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [newPatientName, setNewPatientName] = useState("");

  async function search() {
    if (!q.trim()) return setErr("Enter patient name");
    setErr(""); setLoading(true);
    try {
      const data = await proxyRequest(`fhir/Patient?name=${encodeURIComponent(q)}`);
      setPatients(data.entry || []);
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function addPatient() {
    if (!newPatientName.trim()) return setErr("Enter patient name to add");
    setErr(""); setLoading(true);
    try {
      const newPatient = { name: [{ text: newPatientName }] };
      const data = await proxyRequest("fhir/Patient", "POST", newPatient);
      setPatients(prev => [...prev, { resource: data }]);
      setNewPatientName("");
    } catch (e) { setErr(e.message || "Failed to add patient"); }
    finally { setLoading(false); }
  }

  async function updatePatient(id) {
    const updatedName = prompt("Enter new patient name");
    if (!updatedName) return;
    try {
      const data = await proxyRequest(`fhir/Patient/${id}`, "PUT", { name: [{ text: updatedName }] });
      setPatients(prev => prev.map(p => p.resource.id === id ? { resource: data } : p));
    } catch (e) { setErr(e.message || "Failed to update"); }
  }

  async function deletePatient(id) {
    if (!confirm("Are you sure to delete this patient?")) return;
    try {
      await proxyRequest(`fhir/Patient/${id}`, "DELETE");
      setPatients(prev => prev.filter(p => p.resource.id !== id));
    } catch (e) { setErr(e.message || "Failed to delete"); }
  }

  return (
    <div>
      <h2>👥 Patients</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input className="input" placeholder="Search patient" value={q} onChange={e => setQ(e.target.value)} />
        <button onClick={search} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input className="input" placeholder="New patient name" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} />
        <button onClick={addPatient} disabled={loading}>{loading ? "Adding..." : "Add Patient"}</button>
      </div>

      {err && <div className="error">{err}</div>}
      {patients.length === 0 && !loading && !err && <div className="empty">No results yet.</div>}

      {patients.map(p => {
        const patient = p.resource;
        return (
          <div key={patient.id} className="card">
            <div><b>Name:</b> {patient.name?.[0]?.text || "Unnamed"}</div>
            <div><b>ID:</b> {patient.id}</div>
            <button onClick={() => updatePatient(patient.id)}>Update</button>
            <button onClick={() => deletePatient(patient.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
