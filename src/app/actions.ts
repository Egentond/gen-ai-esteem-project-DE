"use server";

import { z } from "zod";
import { applicationSchema, formDataToApplication, type ApplicationState } from "@/lib/application";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  // Honeypot: real people never fill this hidden field, bots usually do.
  if (formData.get("company_fax")) return { status: "success" };

  const raw = formDataToApplication(formData);
  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "A few details need another look.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v !== undefined) as [string, string | string[]][],
      ),
    };
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[loopedy] Supabase not configured — application logged instead:", parsed.data);
      return { status: "success" };
    }
    console.error("[loopedy] Supabase env vars missing in production; application not saved.");
    return { status: "error", message: "Something went wrong on our side. Please try again shortly." };
  }

  const { error } = await supabase.from("applications").insert(parsed.data);

  if (error) {
    console.error("[loopedy] Failed to save application:", error.message);
    return { status: "error", message: "Something went wrong on our side. Please try again shortly." };
  }

  return { status: "success" };
}
