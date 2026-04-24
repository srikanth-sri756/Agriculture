"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

/* ── Chip-based single-select (replaces dropdowns & radio groups) ── */
interface ChipSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  errors: FieldErrors;
  required?: boolean;
  columns?: number;
}

export function FormChipSelect({
  label, name, options, setValue, watch, errors, required, columns = 3,
}: ChipSelectProps) {
  const current = watch(name);
  const error = name.split(".").reduce<FieldErrors | undefined>(
    (acc, key) => acc?.[key] as FieldErrors | undefined,
    errors
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-green-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={cn("grid gap-2", `grid-cols-${columns}`)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {options.map((opt) => {
          const selected = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue(name, opt.value, { shouldValidate: true })}
              className={cn(
                "relative flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 active:scale-95",
                selected
                  ? "border-green-600 bg-green-100 text-green-900 shadow-sm"
                  : "border-green-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50"
              )}
            >
              {selected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
              <span className="leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-red-500">{(error as { message?: string }).message}</p>
      )}
    </div>
  );
}

/* ── Chip-based multi-select (for equipment, crops, weeds etc.) ── */
interface ChipMultiSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  errors: FieldErrors;
  required?: boolean;
  columns?: number;
}

export function FormChipMultiSelect({
  label, name, options, setValue, watch, errors, required, columns = 3,
}: ChipMultiSelectProps) {
  const current: string[] = watch(name) || [];
  const error = name.split(".").reduce<FieldErrors | undefined>(
    (acc, key) => acc?.[key] as FieldErrors | undefined,
    errors
  );

  const toggle = (val: string) => {
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    setValue(name, next, { shouldValidate: true });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-green-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <p className="text-xs text-green-600">Tap all that apply</p>
      <div className={cn("grid gap-2")} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {options.map((opt) => {
          const selected = current.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "relative flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 active:scale-95",
                selected
                  ? "border-green-600 bg-green-100 text-green-900 shadow-sm"
                  : "border-green-200 bg-white text-green-700 hover:border-green-400 hover:bg-green-50"
              )}
            >
              {selected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
              <span className="leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-red-500">{(error as { message?: string }).message}</p>
      )}
    </div>
  );
}

export function FormInput({
  label, name, register, errors,
  type = "text", placeholder, required,
}: FormFieldProps) {
  const error = name.split(".").reduce<FieldErrors | undefined>(
    (acc, key) => acc?.[key] as FieldErrors | undefined,
    errors
  );

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-green-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          "w-full px-3 py-2 rounded-lg border bg-white text-green-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition",
          error ? "border-red-400" : "border-green-200"
        )}
      />
      {error && (
        <p className="text-xs text-red-500">{(error as { message?: string }).message}</p>
      )}
    </div>
  );
}

export function FormSelect({
  label, name, register, errors,
  options = [], required,
}: FormFieldProps) {
  const error = name.split(".").reduce<FieldErrors | undefined>(
    (acc, key) => acc?.[key] as FieldErrors | undefined,
    errors
  );

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-green-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name)}
        className={cn(
          "w-full px-3 py-2 rounded-lg border bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 transition",
          error ? "border-red-400" : "border-green-200"
        )}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{(error as { message?: string }).message}</p>
      )}
    </div>
  );
}

export function FormRadioGroup({
  label, name, register, errors,
  options = [], required,
}: FormFieldProps) {
  const error = name.split(".").reduce<FieldErrors | undefined>(
    (acc, key) => acc?.[key] as FieldErrors | undefined,
    errors
  );

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-green-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm text-green-800">
            <input
              type="radio"
              value={opt.value}
              {...register(name)}
              className="accent-green-700"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500">{(error as { message?: string }).message}</p>
      )}
    </div>
  );
}
