import { z } from "zod";

export const FOCUS_AREAS = [
  "general",
  "career",
  "exam",
  "relationship",
  "money",
  "education",
  "relocation",
  "spiritual",
] as const;

export const birthFormSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(60, "İsim çok uzun"),
  gender: z.enum(["female", "male", "other", ""]).optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih girin")
    .refine((d) => {
      const date = new Date(d);
      const year = Number(d.slice(0, 4));
      return !isNaN(date.getTime()) && year >= 1900 && year <= 2100;
    }, "Tarih 1900-2100 aralığında olmalı"),
  birthTime: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, "Saat formatı HH:mm olmalı")
    .optional()
    .or(z.literal("")),
  birthPlace: z.string().min(2, "Doğum yeri girin"),
  birthTimeAccuracy: z.enum(["exact", "approx", "unknown"]),
  focusArea: z.enum(FOCUS_AREAS),
});

export type BirthFormValues = z.infer<typeof birthFormSchema>;

// API'nin beklediği tam yük (koordinatlar dahil — sunucuda geocode edilmiş)
export const chartRequestSchema = birthFormSchema.extend({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  timezone: z.string().optional(),
});

export type ChartRequest = z.infer<typeof chartRequestSchema>;
