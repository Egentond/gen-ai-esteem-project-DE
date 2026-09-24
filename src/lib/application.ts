import { z } from "zod";

/** Validation rules for the brand application form. */
export const applicationSchema = z.object({
  brand_name: z.string().trim().min(1, "Add your brand name").max(120),
  website: z
    .string()
    .trim()
    .min(3, "Add your website")
    .max(300)
    .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
    .pipe(z.url("That doesn't look like a web address")),
  contact_name: z.string().trim().min(1, "Add your name").max(120),
  email: z.email("Add a valid email").trim().max(200),
  role: z.string().trim().max(60).optional(),
  category: z.string().trim().min(1, "Pick a category").max(60),
  monthly_orders: z.string().trim().max(40).optional(),
  audience: z.string().trim().min(10, "Tell us a little about your customer").max(1500),
  formats: z.array(z.string().max(60)).max(10).default([]),
  dream_partner: z.string().trim().max(300).optional(),
});

export type Application = z.infer<typeof applicationSchema>;

export type ApplicationState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof Application, string[]>>;
      values?: Record<string, string | string[]>;
    };

/** Turn FormData into a plain object the schema can parse. */
export function formDataToApplication(formData: FormData) {
  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() !== "" ? v : undefined;
  };
  return {
    brand_name: get("brand_name") ?? "",
    website: get("website") ?? "",
    contact_name: get("contact_name") ?? "",
    email: get("email") ?? "",
    role: get("role"),
    category: get("category") ?? "",
    monthly_orders: get("monthly_orders"),
    audience: get("audience") ?? "",
    formats: formData.getAll("formats").filter((v): v is string => typeof v === "string"),
    dream_partner: get("dream_partner"),
  };
}
