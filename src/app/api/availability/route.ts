import { connection } from "next/server";
import { getAvailability } from "@/lib/booking/service";
import { errorResponse } from "@/lib/http";
import { regionSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  await connection(); // always live — never prerender availability
  try {
    const region = regionSchema.parse(new URL(request.url).searchParams.get("region") ?? "perth");
    const slots = await getAvailability(region);
    return Response.json({ slots });
  } catch (error) {
    return errorResponse(error);
  }
}
