"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Clinical() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [newObsName, setNewObsName] = useState("");

  async function load() {
    setLoading(true); setErr("");
    try {
      const data = await proxyRequest("Observation");
      setObservations(data.entry || []);
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function add() {
    if (!newObsName.trim()) return setErr("Enter observation name");
    setLoading(true); setErr("");
    try {
      const newObs = { resourceType: "Observation", status: "final", code: { text: newObsName } };
      const data = await proxyRequest("Observation", "POST", newObs);
      setObservations(prev => [...prev, { resource: data }]);
      setNewObsName("");
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setLoading(false); }
  }

  async function update(id) {
    const updatedName = prompt("Enter new observation name");
    if (!updatedName) return;
    try {
      const data = await proxyRequest(`Observation/${id}`, "PUT", { resourceType: "Observation", id, status: "amended", code: { text: updatedName } });
      setObservations(prev => prev.map(o => o.resource.id === id ? { resource: data } : o));
    } catch (e) { setErr(e.message || "Failed"); }
  }

  async function remove(id) {
    if (!confirm("Delete this observation?")) return;
    try {
      await proxyRequest(`Observation/${id}`, "DELETE");
      setObservations(prev => prev.filter(o => o.resource.id !== id));
    } catch (e) { setErr(e.message || "Failed"); }
  }

  return (
    <div>
      <h2>🧪 Clinical (Observations)</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={load} disabled={loading}>{loading ? "Loading..." : "Load Observations"}</button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input className="input" placeholder="New observation name" value={newObsName} onChange={e => setNewObsName(e.target.value)} />
        <button onClick={add} disabled={loading}>{loading ? "Adding..." : "Add Observation"}</button>
      </div>

      {err && <div className="error">{err}</div>}
      {observations.length === 0 && !loading && !err && <div className="empty">No observations yet.</div>}

      {observations.map(o => {
        const obs = o.resource;
        return (
          <div key={obs.id} className="card">
            <div><b>ID:</b> {obs.id}</div>
            <div><b>Status:</b> {obs.status}</div>
            <div><b>Code:</b> {obs.code?.text || "Unnamed"}</div>
            <button onClick={() => update(obs.id)}>Update</button>
            <button onClick={() => remove(obs.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
