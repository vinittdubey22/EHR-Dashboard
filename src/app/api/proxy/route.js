import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { path, method = "GET", data } = body;

    if (!path) return new Response(JSON.stringify({ error: "Missing path" }), { status: 400 });

    const url = `${process.env.NEXT_PUBLIC_MODMED_BASE_URL}/${process.env.NEXT_PUBLIC_MODMED_FIRM_PREFIX}/${path}`;

    const response = await axios({
      url,
      method: method.toLowerCase(),
      headers: { "x-api-key": process.env.MODMED_API_KEY, Accept: "application/json" },
      auth: { username: process.env.MODMED_USERNAME, password: process.env.MODMED_PASSWORD },
      data,
    });

    return new Response(JSON.stringify(response.data), { status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
