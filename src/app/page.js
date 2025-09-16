export default function Home() {
  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Welcome to the EHR Integration Dashboard</h2>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Manage patients and appointments from one simple interface.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <a href="/patients"><button>🔎 View Patients</button></a>
        <a href="/appointments"><button>📅 View Appointments</button></a>
      </div>
    </div>
  );
}
