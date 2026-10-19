// Forwards /api/* to the FastAPI backend. Read at request time, so API_URL can
// change per environment without rebuilding, and slow LLM calls aren't cut off.
const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function proxy(request: Request, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params;
  const { search } = new URL(request.url);
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  try {
    const upstream = await fetch(`${API_URL}/${path.join("/")}${search}`, {
      method: request.method,
      headers: { "content-type": request.headers.get("content-type") ?? "application/json" },
      body,
      cache: "no-store",
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ detail: "The API is not reachable." }, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE };
