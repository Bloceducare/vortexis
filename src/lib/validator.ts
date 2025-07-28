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

export const organizerSchema = z
  .object({
    name: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."), // Added last name to schema
    email: z.string().email("Please enter a valid email address."),
    organization: z.string().min(2, "Organization name is required."),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    isOrganizer: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must confirm you're signing up as an organizer."
      ),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const participantSchema = z
  .object({
    name: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."), // Added last name to schema
    userName: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  email: z.string().email("A valid email is required.").trim(), 
  otp: z
    .string()
    .length(6, "OTP must be 6 digits.")
    .regex(/^\d+$/, "OTP must contain only digits."),
});
export type OrganizerFormData = z.infer<typeof organizerSchema>;
export type ParticipantFormData = z.infer<typeof participantSchema>;
export type AuthFormType = "organizers" | "participants";
export type OtpFormData = z.infer<typeof otpSchema>;

export type OrganizationFormData = z.infer<typeof organizationSchema>;
