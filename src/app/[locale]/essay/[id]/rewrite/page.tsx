"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import StepProgress from '@/components/layout/StepProgress';
import { ArrowRight, Save, TrendingUp, Sparkles } from 'lucide-react';

export default function RewritePage() {
  const t = useTranslations();
  const router = useRouter();
  const [originalEssay, setOriginalEssay] = useState('');
  const [revisedEssay, setRevisedEssay] = useState('');
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ielts_essay') || '';
    setOriginalEssay(stored);
    setRevisedEssay(stored);
  }, []);

  const handleSubmit = () => {
    setIsComparing(true);
  };

  if (isComparing) {
    return (
      <div className="max-w-6xl mx-auto pb-24 animate-in fade-in">
        <StepProgress currentStep={5} />
        
        <div className="glass-panel bg-emerald-50 border border-emerald-100 rounded-3xl p-10 mb-10 text-center animate-in slide-in-from-bottom-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100/50 blur-[100px] rounded-full pointer-events-none" />
          <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <TrendingUp className="w-10 h-10 text-emerald-600" />
            <Sparkles className="w-6 h-6 text-emerald-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Great Progress!</h2>
          <p className="text-emerald-700 font-bold text-lg">Your revised version shows significant improvement.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden bg-white border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 font-bold mb-3 uppercase tracking-wider text-sm">Version 1 Score</h3>
            <div className="text-5xl font-black text-slate-900">6.5</div>
            <div className="text-sm text-slate-600 font-bold mt-4 bg-slate-50 inline-block px-4 py-1.5 rounded-xl border border-slate-100">14 Grammatical Errors</div>
          </div>
          <div className="glass-panel border border-emerald-200 rounded-3xl p-8 text-center relative overflow-hidden bg-white shadow-sm">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 blur-3xl rounded-full" />
            <h3 className="text-emerald-600 font-bold mb-3 uppercase tracking-wider text-sm">Version 2 Score</h3>
            <div className="text-5xl font-black text-emerald-600">7.5</div>
            <div className="text-sm text-emerald-700 mt-4 bg-emerald-50 inline-block px-4 py-1.5 rounded-xl font-bold border border-emerald-100">Only 2 Grammatical Errors left!</div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button 
            onClick={() => router.push('/my-essays')}
            className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95 text-lg"
          >
            View Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-in fade-in">
      <StepProgress currentStep={5} />

      <div className="mb-10 text-center mt-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Targeted Rewrite</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Apply what you learned in the practice drills to improve your essay.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <div className="glass-panel rounded-3xl flex flex-col overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 font-extrabold text-slate-700 bg-slate-50 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Original Draft
          </div>
          <div className="p-8 flex-1 overflow-auto text-slate-600 whitespace-pre-wrap text-lg leading-loose font-medium">
            {originalEssay}
          </div>
        </div>

        <div className="glass-panel border-2 border-primary/20 focus-within:border-primary focus-within:shadow-xl focus-within:shadow-primary/10 rounded-3xl flex flex-col transition-all overflow-hidden relative bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 font-extrabold text-slate-900 bg-primary/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" /> Revised Version
            </div>
            <span className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 uppercase tracking-wider">Edit here</span>
          </div>
          <textarea
            className="w-full flex-1 p-8 resize-none outline-none text-slate-900 leading-loose bg-transparent text-lg font-medium"
            value={revisedEssay}
            onChange={(e) => setRevisedEssay(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95 text-lg"
        >
          <Save className="w-5 h-5" />
          Submit Revised Version
        </button>
      </div>
    </div>
  );
}
