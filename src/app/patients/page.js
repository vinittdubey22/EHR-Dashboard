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
      const data = await proxyRequest("Patient?name=" + encodeURIComponent(q));
      setPatients(data.entry || []);
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function addPatient() {
    if (!newPatientName.trim()) return setErr("Enter patient name");
    setErr(""); setLoading(true);
    try {
      const newP = { resourceType: "Patient", name: [{ text: newPatientName }] };
      const data = await proxyRequest("Patient", "POST", newP);
      setPatients(prev => [...prev, { resource: data }]);
      setNewPatientName("");
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function updatePatient(id) {
    const name = prompt("Enter new patient name");
    if (!name) return;
    try {
      const data = await proxyRequest("Patient/" + id, "PUT", { resourceType: "Patient", id, name: [{ text: name }] });
      setPatients(prev => prev.map(p => p.resource.id === id ? { resource: data } : p));
    } catch (e) { setErr(e.message || "Failed"); }
  }

  async function deletePatient(id) {
    if (!confirm("Delete this patient?")) return;
    try {
      await proxyRequest("Patient/" + id, "DELETE");
      setPatients(prev => prev.filter(p => p.resource.id !== id));
    } catch (e) { setErr(e.message || "Failed"); }
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
        const pat = p.resource;
        return (
          <div key={pat.id} className="card">
            <div><b>Name:</b> {pat.name?.[0]?.text || "Unnamed"}</div>
            <div><b>ID:</b> {pat.id}</div>
            <button onClick={() => updatePatient(pat.id)}>Update</button>
            <button onClick={() => deletePatient(pat.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
