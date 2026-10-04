"use client";

import { useActionState, type ReactNode } from "react";
import { submitApplication } from "@/app/actions";
import { apply, formOptions } from "@/content/site";
import type { ApplicationState } from "@/lib/application";

const initialState: ApplicationState = { status: "idle" };

export const inputClass =
  "mt-1.5 block w-full rounded-xl border border-line bg-cream/60 px-4 py-3 text-[15px] text-ink placeholder:text-muted/60 focus:border-coral focus:bg-paper focus:ring-2 focus:ring-coral/25 focus:outline-none aria-[invalid=true]:border-coral";

export function ApplicationForm() {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-line bg-mint/50 p-8 sm:p-10">
        <p className="font-display text-2xl font-bold">{apply.success.title}</p>
        <p className="mt-3 text-lg leading-relaxed text-muted">{apply.success.body}</p>
      </div>
    );
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const val = (k: string) => (typeof values[k] === "string" ? (values[k] as string) : undefined);
  const selectedFormats = Array.isArray(values.formats) ? values.formats : [];

  return (
    <form action={formAction} noValidate className="rounded-3xl border border-line bg-cream/40 p-6 sm:p-8">
      {state.status === "error" && (
        <p role="alert" className="mb-6 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral-dark">
          {state.message}
        </p>
      )}

      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company fax <input name="company_fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Brand name" name="brand_name" error={errors.brand_name}>
          <input name="brand_name" id="brand_name" required defaultValue={val("brand_name")} className={inputClass} aria-invalid={!!errors.brand_name} />
        </Field>
        <Field label="Website" name="website" error={errors.website}>
          <input name="website" id="website" required placeholder="yourbrand.com" inputMode="url" defaultValue={val("website")} className={inputClass} aria-invalid={!!errors.website} />
        </Field>
        <Field label="Your name" name="contact_name" error={errors.contact_name}>
          <input name="contact_name" id="contact_name" required autoComplete="name" defaultValue={val("contact_name")} className={inputClass} aria-invalid={!!errors.contact_name} />
        </Field>
        <Field label="Work email" name="email" error={errors.email}>
          <input name="email" id="email" type="email" required autoComplete="email" defaultValue={val("email")} className={inputClass} aria-invalid={!!errors.email} />
        </Field>
        <Field label="Your role" name="role" optional>
          <Select name="role" options={formOptions.roles} defaultValue={val("role")} />
        </Field>
        <Field label="Category" name="category" error={errors.category}>
          <Select name="category" options={formOptions.categories} defaultValue={val("category")} invalid={!!errors.category} />
        </Field>
        <Field label="Orders per month" name="monthly_orders" optional className="sm:col-span-2">
          <Select name="monthly_orders" options={formOptions.monthlyOrders} defaultValue={val("monthly_orders")} />
        </Field>
        <Field label="Who's your typical customer?" name="audience" error={errors.audience} className="sm:col-span-2">
          <textarea
            name="audience"
            id="audience"
            rows={3}
            required
            placeholder="e.g. Women 25–40 who care about clean ingredients and buy a lot of gifts"
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

        <Field label="A brand you'd love to partner with" name="dream_partner" optional className="sm:col-span-2">
          <input name="dream_partner" id="dream_partner" defaultValue={val("dream_partner")} className={inputClass} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-coral px-6 py-3.5 text-base font-semibold text-white shadow-[0_2px_0_0_var(--color-ink)] transition hover:bg-coral-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Apply to be matched →"}
      </button>
      <p className="mt-4 text-sm text-muted">We only use this to find you a partner. No spam, no list selling.</p>
    </form>
  );
}

export function Field({
  label,
  name,
  error,
  optional,
  className = "",
  children,
}: {
  label: string;
  name: string;
  error?: string[];
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-semibold">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error?.[0] && <p className="mt-1.5 text-sm text-coral-dark">{error[0]}</p>}
    </div>
  );
}

export function Select({
  name,
  options,
  defaultValue,
  invalid,
}: {
  name: string;
  options: string[];
  defaultValue?: string;
  invalid?: boolean;
}) {
  return (
    <select name={name} id={name} defaultValue={defaultValue ?? ""} className={inputClass} aria-invalid={invalid}>
      <option value="" disabled>
        Choose one
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
