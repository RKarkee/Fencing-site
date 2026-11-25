import { ZodError, z } from "zod";
import { BookingError } from "@/lib/booking/service";

/** Consistent JSON error responses for route handlers */
export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json({ error: "Please check the highlighted fields.", issues: z.flattenError(error).fieldErrors }, { status: 422 });
  }
  if (error instanceof BookingError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: "Something went wrong on our side. Please call us instead." }, { status: 500 });
}

/** Very small in-memory rate limiter (per IP). Use Upstash/Redis in production. */
const hits = new Map<string, { count: number; reset: number }>();
export function rateLimit(request: Request, limit = 20, windowMs = 60_000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}
