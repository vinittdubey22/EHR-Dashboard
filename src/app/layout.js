"use client";
import "./global.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="page">
        <header className="main-header">
          <h1>🩺 EHR Dashboard</h1>
          <nav className="nav-links">
            <a href="/" className={pathname === "/" ? "active" : ""}>Home</a>
            <a href="/patients" className={pathname === "/patients" ? "active" : ""}>Patients</a>
            <a href="/appointments" className={pathname === "/appointments" ? "active" : ""}>Appointments</a>
            <a href="/clinical" className={pathname === "/clinical" ? "active" : ""}>Clinical</a>
          </nav>
        </header>

        <main>
          <div className="page-container-outer">{children}</div>
        </main>

        <footer>© {year} EHR Dashboard</footer>
      </body>
    </html>
  );
}
