const allowedOriginsEnvName = "AI_CHAT_ALLOWED_ORIGINS";

function getAllowedOrigins(): string[] {
  return (
    process.env[allowedOriginsEnvName]
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

export function buildCorsHeaders(request: Request): Headers {
  const allowedOrigins = getAllowedOrigins();
  const requestOrigin = request.headers.get("origin");
  const allowOrigin =
    requestOrigin && allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0];

  const headers = new Headers({
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
    "Cache-Control": "no-store",
  });

  if (allowOrigin) {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
  }

  return headers;
}

export function buildCorsOptionsResponse(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request),
  });
}
