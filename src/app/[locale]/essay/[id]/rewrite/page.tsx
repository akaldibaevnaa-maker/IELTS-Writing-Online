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
      <div className="max-w-6xl mx-auto pb-24">
        <StepProgress currentStep={5} />
        
        <div className="glass-panel bg-emerald-500/10 border-emerald-500/30 rounded-2xl p-10 mb-10 text-center animate-in slide-in-from-bottom-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <TrendingUp className="w-10 h-10 text-emerald-400" />
            <Sparkles className="w-6 h-6 text-emerald-300 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Great Progress!</h2>
          <p className="text-emerald-300 text-lg">Your revised version shows significant improvement.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden">
            <h3 className="text-slate-400 font-medium mb-3 uppercase tracking-wider text-sm">Version 1 Score</h3>
            <div className="text-5xl font-bold text-slate-300">6.5</div>
            <div className="text-sm text-slate-500 mt-4 bg-white/5 inline-block px-3 py-1 rounded-full">14 Grammatical Errors</div>
          </div>
          <div className="glass-panel border-emerald-500/30 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full" />
            <h3 className="text-emerald-400 font-medium mb-3 uppercase tracking-wider text-sm">Version 2 Score</h3>
            <div className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">7.5</div>
            <div className="text-sm text-emerald-300 mt-4 bg-emerald-500/20 inline-block px-3 py-1 rounded-full font-medium border border-emerald-500/30">Only 2 Grammatical Errors left!</div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button 
            onClick={() => router.push('/progress')}
            className="flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
          >
            View Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <StepProgress currentStep={5} />

      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Targeted Rewrite</h2>
        <p className="text-slate-400">Apply what you learned in the practice drills to improve your essay.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <div className="glass-panel rounded-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 font-semibold text-slate-300 bg-black/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" /> Original Draft
          </div>
          <div className="p-6 flex-1 overflow-auto text-slate-400 whitespace-pre-wrap text-sm leading-loose">
            {originalEssay}
          </div>
        </div>

        <div className="glass-panel border-blue-500/30 focus-within:border-blue-400/80 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.15)] rounded-2xl flex flex-col transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-400" />
          <div className="px-5 py-4 border-b border-white/5 font-semibold text-white bg-blue-500/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Revised Version
            </div>
            <span className="text-xs font-normal bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded text-blue-300">Edit here</span>
          </div>
          <textarea
            className="w-full flex-1 p-6 resize-none outline-none text-slate-200 leading-loose bg-transparent"
            value={revisedEssay}
            onChange={(e) => setRevisedEssay(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-500 transition-all glow-primary"
        >
          <Save className="w-5 h-5" />
          Submit Revised Version
        </button>
      </div>
    </div>
  );
}
