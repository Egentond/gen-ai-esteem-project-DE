"use client";

import { useActionState, useState, useTransition } from "react";
import { recordFeedback, runMatching, type MatchState } from "@/app/match/actions";
import { Field, Select, inputClass } from "@/components/application-form";
import { formOptions } from "@/content/site";
import type { Application } from "@/lib/application";
import type { Match } from "@/lib/matching";

const initialState: MatchState = { status: "idle" };

export function MatchClient({ defaults }: { defaults?: Application }) {
  const [state, formAction, pending] = useActionState(runMatching, initialState);

  if (state.status === "done") {
    return <Results state={state} />;
  }

  const errors = state.status === "invalid" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "invalid" ? (state.values ?? {}) : {};
  const val = (k: keyof Application) => {
    const v = values[k];
    if (typeof v === "string") return v;
    const d = defaults?.[k];
    return typeof d === "string" ? d : undefined;
  };
  const selectedFormats = Array.isArray(values.formats) ? values.formats : (defaults?.formats ?? []);

  return (
    <form action={formAction} noValidate className="rounded-3xl border border-line bg-cream/40 p-6 sm:p-8">
      {state.status === "invalid" && (
        <p role="alert" className="mb-6 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral-dark">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Brand name" name="brand_name" error={errors.brand_name}>
          <input name="brand_name" id="brand_name" defaultValue={val("brand_name")} className={inputClass} aria-invalid={!!errors.brand_name} />
        </Field>
        <Field label="Website" name="website" error={errors.website}>
          <input name="website" id="website" placeholder="yourbrand.com" defaultValue={val("website")} className={inputClass} aria-invalid={!!errors.website} />
        </Field>
        <Field label="Your name" name="contact_name" error={errors.contact_name}>
          <input name="contact_name" id="contact_name" defaultValue={val("contact_name")} className={inputClass} aria-invalid={!!errors.contact_name} />
        </Field>
        <Field label="Work email" name="email" error={errors.email}>
          <input name="email" id="email" type="email" defaultValue={val("email")} className={inputClass} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Category" name="category" error={errors.category}>
          <Select name="category" options={formOptions.categories} defaultValue={val("category")} invalid={!!errors.category} />
        </Field>
        <Field label="Orders per month" name="monthly_orders" optional>
          <Select name="monthly_orders" options={formOptions.monthlyOrders} defaultValue={val("monthly_orders")} />
        </Field>
        <Field label="Who's your typical customer?" name="audience" error={errors.audience} className="sm:col-span-2">
          <textarea
            name="audience"
            id="audience"
            rows={4}
            placeholder="e.g. Women 25–40 who care about clean ingredients, go to Pilates and buy a lot of gifts"
            defaultValue={val("audience")}
            className={inputClass}
            aria-invalid={!!errors.audience}
          />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold">
            Collabs you&apos;d be up for <span className="font-normal text-muted">(pick any)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {formOptions.formats.map((f) => (
              <label key={f} className="cursor-pointer">
                <input type="checkbox" name="formats" value={f} defaultChecked={selectedFormats.includes(f)} className="peer sr-only" />
                <span className="inline-block rounded-full border border-line bg-paper px-3.5 py-2 text-sm font-medium transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-coral">
                  {f}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-coral px-6 py-3.5 text-base font-semibold text-white shadow-[0_2px_0_0_var(--color-ink)] transition hover:bg-coral-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Finding your matches…" : "Find my matches →"}
      </button>
      {pending && <p className="mt-3 text-sm text-muted">This usually takes 10 to 30 seconds.</p>}
    </form>
  );
}

function Results({ state }: { state: Extract<MatchState, { status: "done" }> }) {
  const { result, founder } = state;

  if (result.status === "needs_detail") {
    return (
      <div role="status" className="rounded-3xl border border-line bg-butter/40 p-8">
        <p className="font-display text-2xl font-bold">We need a bit more before we can match you.</p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted">
          {result.missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <StartOver />
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div role="alert" className="rounded-3xl border border-coral/40 bg-coral/10 p-8">
        <p className="font-display text-xl font-bold text-coral-dark">{result.message}</p>
        <StartOver />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-3xl border border-line bg-paper p-6">
        <p className="text-sm font-semibold text-muted">How we read {founder.brand_name}</p>
        <p className="mt-2 text-lg">
          <b>{result.profile.product}</b> for {result.profile.customer.replace(/\.$/, "")}.
        </p>
        <p className="mt-1 text-sm text-muted">
          Price: {result.profile.price_tier} · Cares about: {result.profile.values.join(", ")}
        </p>
      </div>

      {result.matches.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-cream p-6 text-muted">
          No strong partners in the pool yet. We&apos;ll keep your application and reach out when a good fit joins.
        </p>
      ) : (
        <ol className="mt-8 space-y-5">
          {result.matches.map((m, i) => (
            <MatchCard key={m.id} match={m} rank={i + 1} founder={founder} />
          ))}
        </ol>
      )}

      <details className="mt-8 text-sm text-muted">
        <summary className="cursor-pointer font-medium">Why other brands were left out</summary>
        <ul className="mt-3 space-y-1">
          {[...result.removedByRules, ...result.removedByModel].map((r) => (
            <li key={r.id}>
              <b className="text-ink">{r.brand_name}:</b> {r.reason}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          {result.model} · {(result.ms / 1000).toFixed(1)}s
        </p>
      </details>
      <StartOver />
    </div>
  );
}

function MatchCard({ match, rank, founder }: { match: Match; rank: number; founder: { brand_name: string; email: string } }) {
  const [choice, setChoice] = useState<"interested" | "skip" | null>(null);
  const [failed, setFailed] = useState(false);
  const [saving, startSaving] = useTransition();

  const choose = (decision: "interested" | "skip") =>
    startSaving(async () => {
      const res = await recordFeedback({
        founder_email: founder.email,
        founder_brand: founder.brand_name,
        partner_id: match.id,
        decision,
        fit: match.fit,
      });
      setFailed(!res.ok);
      if (res.ok) setChoice(decision);
    });

  return (
    <li className={`rounded-3xl border border-line bg-paper p-6 transition ${choice === "skip" ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-xl font-bold">
          {rank}. {match.brand_name}
        </p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${match.fit === "high" ? "bg-mint" : "bg-butter"}`}>
          {match.fit === "high" ? "Strong fit" : "Possible fit"}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {match.product} · {match.category}
      </p>

      <ul className="mt-4 space-y-3">
        {match.reasons.map((r) => (
          <li key={r.point}>
            <p>{r.point}</p>
            <p className="mt-1 text-sm text-muted">
              You said &ldquo;{r.founder_quote}&rdquo; · They said &ldquo;{r.partner_quote}&rdquo;
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-xl bg-lilac/30 px-4 py-3 text-sm">
        <b>Suggested collab: {match.suggested_format}.</b> {match.format_why}
      </p>

      <div className="mt-5 flex gap-3">
        {choice ? (
          <p className="text-sm font-medium">
            {choice === "interested" ? "Saved. We'll check if they're interested too." : "Skipped."}
          </p>
        ) : (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => choose("interested")}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink/85 disabled:opacity-60"
            >
              Interested
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => choose("skip")}
              className="rounded-full bg-paper px-5 py-2.5 text-sm font-semibold ring-1 ring-ink/15 hover:ring-ink/40 disabled:opacity-60"
            >
              Skip
            </button>
          </>
        )}
        {failed && <p className="text-sm text-coral-dark">Couldn&apos;t save that, try again.</p>}
      </div>
    </li>
  );
}

function StartOver() {
  return (
    <a href="/match" className="mt-6 inline-block text-sm font-semibold text-coral hover:text-coral-dark">
      ← Start over
    </a>
  );
}
