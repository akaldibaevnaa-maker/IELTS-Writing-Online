"use client";

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function StepProgress({ currentStep }: { currentStep: number }) {
  const t = useTranslations('Steps');

  const steps = [
    { id: 1, name: t('task', { defaultMessage: 'Task' }) },
    { id: 2, name: t('essay', { defaultMessage: 'Essay' }) },
    { id: 3, name: t('analysis', { defaultMessage: 'Analysis' }) },
    { id: 4, name: t('result', { defaultMessage: 'Result' }) },
    { id: 5, name: t('plan', { defaultMessage: 'Plan' }) },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 mb-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-200 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary -z-10 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 relative group">
              <div 
                className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300 border-[3px]",
                  isCompleted ? "bg-primary border-primary text-white shadow-md shadow-primary/20" :
                  isCurrent ? "bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-110" :
                  "bg-white border-slate-200 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : step.id}
              </div>
              <span 
                className={clsx(
                  "text-sm font-bold absolute -bottom-8 whitespace-nowrap transition-colors",
                  isCurrent ? "text-primary" :
                  isCompleted ? "text-slate-700" :
                  "text-slate-400"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
