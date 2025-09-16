"use client";
import { useState } from "react";
import { proxyRequest } from "../../lib/apiClient";

export default function Patients() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    if (!query.trim()) {
      setError("Please enter a name");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await proxyRequest(`fhir/Patient?name=${encodeURIComponent(query)}`);
      setResults(data.entry || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ animation: "fadeIn 0.6s ease-in-out" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>👥 Patients</h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Enter a patient name below and click search.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient by name"
          style={{ flex: 1 }}
        />
        <button onClick={search} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      {results.length === 0 && !loading && !error && (
        <p style={{ color: "#888" }}>No results yet. Try searching.</p>
      )}

      {results.map((e, i) => {
        const patient = e.resource;
        return (
          <div
            className="card"
            key={patient.id}
            style={{
              animation: "fadeUp 0.4s ease",
              animationDelay: `${i * 0.05}s`
            }}
          >
            <strong style={{ fontSize: "1.1rem" }}>
              {patient.name?.[0]?.text || "Unnamed Patient"}
            </strong>
            <p style={{ color: "#555" }}>ID: {patient.id}</p>
          </div>
        );
      })}
    </div>
  );
}
