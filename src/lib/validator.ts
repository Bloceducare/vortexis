import { z } from "zod";

export const organizationSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(128, "Organization name must be 128 characters or less"),

  organizationWebsite: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal(""))
    .optional(),

  logo: z
    .instanceof(File, { message: "Please upload a logo file" })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "File size must be less than 2MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG and PNG files are allowed"
    )
    .optional(),

  customUrl: z
    .string()
    .min(1, "Custom URL is required")
    .max(128, "Custom URL must be 128 characters or less")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Custom URL can only contain letters, numbers, hyphens, and underscores"
    ),

  location: z
    .string()
    .min(1, "Location is required")
    .max(32, "Location must be 32 characters or less"),

  tagline: z
    .string()
    .min(1, "Tagline is required")
    .max(200, "Tagline must be 200 characters or less"),

  about: z
    .string()
    .min(1, "About section is required")
    .max(5000, "About section must be 5000 characters or less"),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
