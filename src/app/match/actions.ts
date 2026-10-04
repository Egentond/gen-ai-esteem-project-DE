"use server";

import { z } from "zod";
import { applicationSchema, formDataToApplication } from "@/lib/application";
import { findMatches, type MatchResult } from "@/lib/matching";
import { getSupabaseAdmin } from "@/lib/supabase";

export type MatchState =
  | { status: "idle" }
  | {
      status: "invalid";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: Record<string, string | string[]>;
    }
  | { status: "done"; founder: { brand_name: string; email: string }; result: MatchResult };

/** Submit the application, save it like the landing page does, then run matching on it. */
export async function runMatching(_prev: MatchState, formData: FormData): Promise<MatchState> {
  const raw = formDataToApplication(formData);
  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "invalid",
      message: "A few details need another look.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v !== undefined) as [string, string | string[]][],
      ),
    };
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("applications").insert(parsed.data);
    if (error) console.error("[loopedy] Failed to save application before matching:", error.message);
  }

  const result = await findMatches(parsed.data);
  return { status: "done", founder: { brand_name: parsed.data.brand_name, email: parsed.data.email }, result };
}

const feedbackSchema = z.object({
  founder_email: z.email(),
  founder_brand: z.string().min(1).max(120),
  partner_id: z.string().min(1).max(80),
  decision: z.enum(["interested", "skip"]),
  fit: z.enum(["high", "medium"]),
});

/** Save the founder's interested/skip choice on one suggested partner. */
export async function recordFeedback(input: z.input<typeof feedbackSchema>): Promise<{ ok: boolean }> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.info("[loopedy] Supabase not configured. Match feedback logged instead:", parsed.data);
    return { ok: true };
  }

  const { error } = await supabase.from("match_feedback").insert(parsed.data);
  if (error) {
    console.error("[loopedy] Failed to save match feedback:", error.message);
    return { ok: false };
  }
  return { ok: true };
}
