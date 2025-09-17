import { NextResponse } from "next/server";

const FHIR_BASE_URL = "https://hapi.fhir.org/baseR4"; 

export async function POST(req) {
  try {
    const { path, method, body } = await req.json();

    if (!path || !method) {
      return NextResponse.json({ error: "Missing path or method" }, { status: 400 });
    }

    const url = `${FHIR_BASE_URL}/${path}`;
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      body: ["POST", "PUT"].includes(method) ? JSON.stringify(body) : undefined,
    };

    const res = await fetch(url, options);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data.issue?.[0]?.diagnostics || data || "FHIR request failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}
