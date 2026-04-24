"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";

interface StepperProps {
  steps: number;
  currentStep: number;
  completedSteps?: Set<number>;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, completedSteps, onStepClick }: StepperProps) {
  const { lang } = useLang();

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max px-2">
        {Array.from({ length: steps }, (_, i) => {
          const step = i + 1;
          const isCompleted = completedSteps ? completedSteps.has(step) : step < currentStep;
          const isCurrent = step === currentStep;
          const canNavigate = isCompleted || isCurrent;

          return (
            <div key={step} className="flex items-center">
              <button
                onClick={() => canNavigate && onStepClick?.(step)}
                disabled={!canNavigate}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-medium whitespace-nowrap",
                  isCompleted && "text-green-700 bg-green-100 cursor-pointer",
                  isCurrent && "text-white bg-green-800 shadow-md",
                  !isCompleted && !isCurrent && "text-gray-400 bg-gray-100 cursor-not-allowed opacity-60"
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                    isCompleted && "bg-green-600 border-green-600 text-white",
                    isCurrent && "bg-white border-white text-green-800",
                    !isCompleted && !isCurrent && "border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : step}
                </span>
                <span className="hidden sm:inline">{t(`step.${step}`, lang)}</span>
              </button>
              {step < steps && (
                <div
                  className={cn(
                    "h-0.5 w-6 mx-1",
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
