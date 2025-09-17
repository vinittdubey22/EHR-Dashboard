export async function proxyRequest(path, method = "GET", body = null) {
  const res = await fetch("/api/proxy", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, body }),
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const errData = await res.json();
      errMsg = errData.error || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return res.json();
}
