import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(15),
  line1: z.string().trim().min(3, "Address is required").max(150),
  line2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(2, "City is required").max(60),
  state: z.string().trim().min(2, "State is required").max(60),
  postalCode: z.string().trim().min(3, "Postal code is required").max(12),
  country: z.string().trim().min(2, "Country is required").max(60),
});
