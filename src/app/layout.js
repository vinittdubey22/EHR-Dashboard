
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EHR Dashboard",
  description: "Mini project - Electronic Health Record system using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="main-header">
          <h1>EHR Dashboard</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/patients">Patients</a>
            <a href="/appointments">Appointments</a>
          </nav>
        </header>
        <main className="page-container">{children}</main>
      </body>
    </html>
  );
}
