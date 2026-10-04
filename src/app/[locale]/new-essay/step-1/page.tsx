"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import StepProgress from '@/components/layout/StepProgress';
import { ArrowRight, Lightbulb, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';

export default function Step1Page() {
  const t = useTranslations();
  const router = useRouter();
  const [taskText, setTaskText] = useState('');
  const [detectedType, setDetectedType] = useState<string | null>(null);

  const taskTypes = [
    'Agree / Disagree',
    'Discuss Both Views',
    'Problem / Solution',
    'Advantages / Disadvantages',
    'Two-part Question'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('ielts_task');
    if (saved) setTaskText(saved);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTaskText(val);
    
    // Auto-detect dummy logic
    if (val.length > 20) {
      if (val.toLowerCase().includes('agree')) setDetectedType('Agree / Disagree');
      else if (val.toLowerCase().includes('discuss')) setDetectedType('Discuss Both Views');
      else if (val.toLowerCase().includes('problem')) setDetectedType('Problem / Solution');
      else if (val.toLowerCase().includes('advantage')) setDetectedType('Advantages / Disadvantages');
      else setDetectedType('Two-part Question');
    } else {
      setDetectedType(null);
    }
  };

  const handleContinue = () => {
    localStorage.setItem('ielts_task', taskText);
    router.push('/new-essay/step-2');
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in">
      <StepProgress currentStep={1} />
      
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('Step1.title', { defaultMessage: 'Введите задание IELTS Writing Task 2' })}</h2>
            <p className="text-lg text-slate-500 font-medium">{t('Step1.subtitle', { defaultMessage: 'Paste your prompt here to get started.' })}</p>
          </div>

          <div className="glass-panel p-2 focus-within:ring-4 focus-within:ring-primary/20 transition-all rounded-2xl bg-white shadow-lg">
            <textarea 
              className="w-full min-h-[250px] p-6 bg-transparent resize-y outline-none text-slate-800 text-lg leading-relaxed font-medium placeholder:text-slate-300"
              placeholder={t('Step1.placeholder', { defaultMessage: 'Some people think that... To what extent do you agree or disagree?' })}
              value={taskText}
              onChange={handleTextChange}
            />
          </div>

          {detectedType && (
            <div className="glass-panel border-primary/20 rounded-2xl p-6 flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 bg-primary/5">
              <div className="bg-white p-3 rounded-xl text-primary mt-1 shadow-sm border border-primary/10">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-3 text-lg">{t('Step1.autoIdentified', { defaultMessage: 'Определен тип задания:' })}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {taskTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setDetectedType(type)}
                      className={clsx(
                        "px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-center border",
                        detectedType === type 
                          ? "bg-primary text-white border-primary shadow-md" 
                          : "bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 border-slate-200 shadow-sm"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6">
            <button 
              onClick={handleContinue}
              disabled={!taskText.trim()}
              className="flex items-center justify-center w-full md:w-auto gap-2 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t('Common.continue', { defaultMessage: 'Продолжить' })}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 hidden lg:block">
          <div className="glass-panel rounded-2xl p-8 bg-slate-50 border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-primary font-bold mb-6 text-lg">
              <Lightbulb className="w-6 h-6" />
              {t('Step1.tipsTitle', { defaultMessage: 'Советы' })}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              {t('Step1.tipsDesc', { defaultMessage: 'Внимательно прочитайте задание, чтобы убедиться, что вы ответили на все части вопроса.' })}
            </p>
            
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">COMMON TYPES</h4>
            <ul className="space-y-4 text-sm text-slate-700 font-bold">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/40"/> Agree / Disagree</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/40"/> Discuss Both Views</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/40"/> Problem / Solution</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary/40"/> Advantages / Disadvantages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
