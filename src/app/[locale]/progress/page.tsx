"use client";

import { useTranslations } from 'next-intl';
import { TrendingUp, FileText, BarChart3, Clock, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function ProgressPage() {
  const t = useTranslations('Progress');
  
  const history = [
    { id: 1, date: 'Today', type: 'Discuss Both Views', score1: 6.5, score2: 7.5, weakness: 'Grammar' },
    { id: 2, date: '2 days ago', type: 'Problem / Solution', score1: 6.0, score2: 6.5, weakness: 'Vocabulary' },
    { id: 3, date: '1 week ago', type: 'Agree / Disagree', score1: 5.5, score2: 6.5, weakness: 'Task Response' },
  ];

  const radarData = [
    { subject: 'Task Response', A: 6.5, fullMark: 9 },
    { subject: 'Coherence', A: 6.0, fullMark: 9 },
    { subject: 'Lexical Resource', A: 6.5, fullMark: 9 },
    { subject: 'Grammar', A: 5.5, fullMark: 9 },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group bg-white border-slate-200 shadow-sm">
          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center relative z-10">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{t('avgImprovement')}</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">+1.0 <span className="text-lg text-slate-500 font-medium">Band</span></div>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group bg-white border-slate-200 shadow-sm">
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center relative z-10">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{t('essaysWritten')}</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">3</div>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group bg-white border-slate-200 shadow-sm">
          <div className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center relative z-10">
            <BarChart3 className="w-8 h-8 text-amber-600" />
          </div>
          <div className="relative z-10">
            <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{t('topWeakness')}</div>
            <div className="text-xl font-black text-slate-900 tracking-tight">Grammar</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden flex flex-col bg-white border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-xl font-extrabold text-slate-900">{t('recent')}</h2>
          </div>
          <div className="grid grid-cols-5 bg-white border-b border-slate-100 px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">Task</div>
            <div>V1 Score</div>
            <div>V2 Score</div>
            <div>Focus</div>
          </div>
          
          <div className="flex-1 overflow-auto bg-white">
            {history.map((item, idx) => (
              <div key={item.id} className={clsx(
                "grid grid-cols-5 px-6 py-5 hover:bg-slate-50 transition-colors group cursor-pointer items-center",
                idx !== history.length - 1 && "border-b border-slate-100"
              )}>
                <div className="col-span-2 pr-4">
                  <div className="font-bold text-slate-900 line-clamp-1">{item.type}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 font-medium">
                    <Clock className="w-4 h-4" /> {item.date}
                  </div>
                </div>
                <div className="text-slate-500 font-bold">{item.score1}</div>
                <div className="text-emerald-600 font-black flex items-center gap-2">
                  {item.score2}
                  <ChevronRight className="w-5 h-5 text-emerald-600/50 opacity-0 group-hover:opacity-100 transition-opacity absolute right-6" />
                </div>
                <div>
                  <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                    {item.weakness}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col bg-white border-slate-200 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">{t('radarTitle')}</h2>
          <div className="flex-1 min-h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 9]} tick={{ fill: '#94A3B8' }} />
                <Radar name="Score" dataKey="A" stroke="#C8102E" fill="#C8102E" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }} itemStyle={{ color: '#C8102E' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

import clsx from 'clsx';
