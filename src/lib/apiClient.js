export async function proxyRequest(path, method = "GET", data) {
  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, data }),
  });
  if (!res.ok) throw new Error(await res.text() || "Request failed");
  return res.json();
}
