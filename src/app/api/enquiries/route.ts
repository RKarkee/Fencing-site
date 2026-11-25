import { createEnquiry } from "@/lib/booking/service";
import { errorResponse, rateLimit } from "@/lib/http";

export async function POST(request: Request) {
  if (!rateLimit(request, 10)) return Response.json({ error: "Too many requests — please wait a minute." }, { status: 429 });
  try {
    const enquiry = await createEnquiry(await request.json());
    return Response.json({ enquiry }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
