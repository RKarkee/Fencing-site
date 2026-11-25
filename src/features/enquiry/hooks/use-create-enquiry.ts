"use client";

import { useMutation } from "@tanstack/react-query";
import { enquiryApi } from "@/features/booking/api";
import type { EnquiryInput } from "@/lib/schemas";

export function useCreateEnquiry() {
  return useMutation({ mutationFn: (input: EnquiryInput) => enquiryApi.create(input) });
}
