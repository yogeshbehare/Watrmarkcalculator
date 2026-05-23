"use client";

import { Calculator, Globe2, MessageCircle, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LogoMark } from "@/components/LogoMark";
import { ResultCards } from "@/components/ResultCards";
import { UploadDropzone } from "@/components/UploadDropzone";
import { BUSINESS } from "@/lib/constants";
import type { AnalyzeResponse } from "@/lib/types";
import { validateQuoteInput } from "@/utils/validation";

type FormState = {
  width: string;
  height: string;
  quantity: string;
};

const defaultForm: FormState = {
  width: "3",
  height: "3",
  quantity: "100"
};

export default function Home() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const numericValues = useMemo(
    () => ({
      width: Number(form.width),
      height: Number(form.height),
      quantity: Number(form.quantity)
    }),
    [form]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const validationError = validateQuoteInput({
      ...numericValues,
      file
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!file) return;

    const payload = new FormData();
    payload.append("width", String(numericValues.width));
    payload.append("height", String(numericValues.height));
    payload.append("quantity", String(numericValues.quantity));
    payload.append("file", file);

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: payload
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to calculate quote.");
      }

      setResult(data as AnalyzeResponse);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to calculate quote."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <header className="flex flex-col gap-4 border-b border-brand-line pb-5 sm:flex-row sm:items-center sm:justify-between">
          <LogoMark />
          <div className="flex flex-wrap gap-2 text-sm text-brand-muted">
            <a
              href={`https://${BUSINESS.website}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-brand-line bg-white px-3 py-2 font-semibold transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Globe2 className="h-4 w-4" />
              {BUSINESS.website}
            </a>
            <a
              href={`https://wa.me/${BUSINESS.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-brand-line bg-white px-3 py-2 font-semibold transition hover:border-brand-orange hover:text-brand-orange"
            >
              <MessageCircle className="h-4 w-4" />
              {BUSINESS.displayWhatsApp}
            </a>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="grid gap-6">
            <div className="rounded-lg border border-brand-line bg-white p-6 shadow-premium sm:p-8">
              <div className="mb-7">
                <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">
                  <ShieldCheck className="h-4 w-4" />
                  Server-side artwork analysis
                </p>
                <h1 className="mt-5 text-3xl font-black tracking-normal text-brand-ink sm:text-4xl">
                  Watrmark Print Quote Calculator
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-brand-muted">
                  Upload artwork, enter print size and quantity, and generate a
                  practical print quote for your order.
                </p>
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-brand-ink">
                      Print Width (inches)
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      value={form.width}
                      disabled={isLoading}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, width: event.target.value }))
                      }
                      className="h-12 rounded-md border border-brand-line bg-white px-3 text-brand-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-brand-ink">
                      Print Height (inches)
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      value={form.height}
                      disabled={isLoading}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, height: event.target.value }))
                      }
                      className="h-12 rounded-md border border-brand-line bg-white px-3 text-brand-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-brand-ink">
                      Quantity
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={form.quantity}
                      disabled={isLoading}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          quantity: event.target.value
                        }))
                      }
                      className="h-12 rounded-md border border-brand-line bg-white px-3 text-brand-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <UploadDropzone file={file} onChange={setFile} disabled={isLoading} />

                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-orange px-5 text-sm font-bold text-white shadow-card transition hover:bg-brand-orangeDark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Calculator className="h-4 w-4" />
                      Generate Quote
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:sticky lg:top-5">
            {result ? (
              <ResultCards result={result} />
            ) : (
              <div className="rounded-lg border border-brand-line bg-white p-6 shadow-premium sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                  Ready for quote
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-normal text-brand-ink">
                  Your quote summary will appear here.
                </h2>
                <p className="mt-4 text-base leading-7 text-brand-muted">
                  Upload the artwork, enter print size and quantity, then generate a
                  quote for the order.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
