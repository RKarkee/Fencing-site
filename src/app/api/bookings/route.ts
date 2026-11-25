import { createBooking } from "@/lib/booking/service";
import { errorResponse, rateLimit } from "@/lib/http";

export async function POST(request: Request) {
  if (!rateLimit(request, 10)) return Response.json({ error: "Too many requests — please wait a minute." }, { status: 429 });
  try {
    const booking = await createBooking(await request.json());
    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
