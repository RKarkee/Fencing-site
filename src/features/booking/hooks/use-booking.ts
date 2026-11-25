"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BookingInput, Region } from "@/lib/schemas";
import { bookingApi } from "../api";

export const bookingKeys = {
  availability: (region: Region) => ["availability", region] as const,
};

export function useAvailability(region: Region) {
  return useQuery({
    queryKey: bookingKeys.availability(region),
    queryFn: () => bookingApi.availability(region),
    select: (data) => data.slots,
    staleTime: 30_000,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BookingInput) => bookingApi.create(input),
    // A booked slot disappears for everyone → refresh that region's availability
    onSettled: (_data, _error, input) => queryClient.invalidateQueries({ queryKey: bookingKeys.availability(input.region) }),
  });
}
