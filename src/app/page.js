export default function Home() {
  return (
    <div className="page-container" style={{ animation: "fadeIn 0.6s ease-in-out" }}>
      <main className="container" style={{ textAlign: "center", marginTop: "3rem" }}>

        <p style={{ fontSize: "1.1rem", color: "#4b5563", marginBottom: "2rem" }}>
          Welcome to the EHR Integration Dashboard.  
          Manage patients and appointments from one place.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <a href="/patients">
            <button style={{ fontSize: "1rem", minWidth: "160px" }}>🔎 View Patients</button>
          </a>
          <a href="/appointments">
            <button style={{ fontSize: "1rem", minWidth: "160px" }}>📅 View Appointments</button>
          </a>
        </div>
      </main>

      <footer
        className="page-container"
        style={{
          marginTop: "3rem",
          fontSize: "0.85rem",
          color: "#6b7280",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "1rem"
        }}
      >
      </footer>
    </div>
  );
}
