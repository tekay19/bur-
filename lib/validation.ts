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
      const [y, m, day] = d.split("-").map(Number);
      if (y < 1900 || y > 2100 || m < 1 || m > 12 || day < 1 || day > 31)
        return false;
      // Gerçek takvim günü mü? (31 Şubat gibi sessiz kaymaları reddet)
      const dt = new Date(Date.UTC(y, m - 1, day));
      return (
        dt.getUTCFullYear() === y &&
        dt.getUTCMonth() === m - 1 &&
        dt.getUTCDate() === day
      );
    }, "Geçerli bir tarih girin (1900-2100)"),
  birthTime: z
    .string()
    // Saat 00-23, dakika 00-59 (taşan "25:99" gibi değerleri reddet)
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, "Saat formatı HH:mm olmalı")
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
