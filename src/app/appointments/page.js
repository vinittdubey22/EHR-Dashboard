"use client";
import { useEffect, useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [practitionerId, setPractitionerId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [apptId, setApptId] = useState("");
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await proxyRequest("Practitioner");
        setPractitioners(res.entry?.map(e => e.resource) || []);
      } catch {
        setErr("error loading doctors");
      }
    }
    loadDoctors();
  }, []);

  async function searchPatient() {
    setPatientId("");
    if (!searchName.trim()) return setErr("enter name");
    setErr(""); setLoading(true);
    try {
      const res = await proxyRequest(`Patient?name=${encodeURIComponent(searchName)}`);
      const found = res.entry?.map(e => e.resource) || [];
      setPatients(found);
      if (found.length === 1) setPatientId(found[0].id);
    } catch {
      setErr("error searching");
    } finally {
      setLoading(false);
    }
  }

  async function addPatient() {
    if (!searchName.trim()) return setErr("enter name");
    setErr(""); setLoading(true);
    try {
      const newP = { resourceType: "Patient", name: [{ text: searchName }] };
      const res = await proxyRequest("Patient", "POST", newP);
      setPatients([res]);
      setPatientId(res.id);
    } catch {
      setErr("error adding");
    } finally {
      setLoading(false);
    }
  }

  async function book(e) {
    e.preventDefault();
    setErr(""); setApptId(""); setStatus("");
    if (!patientId || !practitionerId || !date || !reason) return setErr("fill all fields");
    setLoading(true);
    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate.getTime() + 30 * 60000);
      const appt = {
        resourceType: "Appointment",
        status: "booked",
        description: reason,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        participant: [
          { actor: { reference: `Patient/${patientId}` }, status: "accepted" },
          { actor: { reference: `Practitioner/${practitionerId}` }, status: "accepted" }
        ]
      };
      const res = await proxyRequest("Appointment", "POST", appt);
      setApptId(res.id);
      setStatus(res.status);
    } catch (e) {
      setErr(e.message || "error booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Book Appointment</h2>
      <div className="card" style={{ marginBottom: "1rem" }}>
        <input className="input" placeholder="Enter Patient Name" value={searchName} onChange={e => setSearchName(e.target.value)} />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button onClick={searchPatient} disabled={loading}>Search</button>
          <button onClick={addPatient} disabled={loading}>Add Patient</button>
        </div>
        {patients.length > 0 && (
          <select className="input" value={patientId} onChange={e => setPatientId(e.target.value)}>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name?.[0]?.text || `Patient ${p.id}`}</option>
            ))}
          </select>
        )}
      </div>
      <form onSubmit={book} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "450px" }}>
        <select className="input" value={practitionerId} onChange={e => setPractitionerId(e.target.value)} required>
          <option value="">Select Doctor</option>
          {practitioners.map(d => (
            <option key={d.id} value={d.id}>{d.name?.[0]?.text || `Doctor ${d.id}`}</option>
          ))}
        </select>
        <input className="input" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
        <textarea className="input" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Booking..." : "Book"}</button>
      </form>
      {err && <div className="error">{err}</div>}
      {apptId && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <div><b>ID:</b> {apptId}</div>
          <div><b>Status:</b> {status}</div>
        </div>
      )}
    </div>
  );
}
