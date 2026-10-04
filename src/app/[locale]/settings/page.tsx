"use client";

import { useTranslations } from 'next-intl';
import { Save, Bell, Globe, Target, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const [targetScore, setTargetScore] = useState('7.0');
  const [explLang, setExplLang] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [density, setDensity] = useState('normal');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.targetScore) setTargetScore(parsed.targetScore);
        if (parsed.explLang) setExplLang(parsed.explLang);
        if (typeof parsed.notifications === 'boolean') setNotifications(parsed.notifications);
        if (parsed.density) setDensity(parsed.density);
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    const settings = { targetScore, explLang, notifications, density };
    localStorage.setItem('user_settings', JSON.stringify(settings));
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in">
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0">✓</div>
          {t('saveSuccess', { defaultMessage: 'Settings saved successfully!' })}
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle')}</p>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 lg:p-8 rounded-3xl bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-extrabold text-slate-900">{t('targetScore')}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['6.0', '6.5', '7.0', '7.5', '8.0+'].map(score => (
              <button 
                key={score}
                onClick={() => setTargetScore(score)}
                className={clsx(
                  "px-4 py-3 rounded-xl font-bold transition-all text-lg border",
                  targetScore === score 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 lg:p-8 rounded-3xl bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <Globe className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-extrabold text-slate-900">{t('explanationLang')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'en', label: 'English' },
              { id: 'kk', label: 'Қазақша' },
              { id: 'ru', label: 'Русский' }
            ].map(lang => (
              <button 
                key={lang.id}
                onClick={() => setExplLang(lang.id)}
                className={clsx(
                  "px-5 py-4 rounded-xl font-bold transition-all text-left flex items-center justify-between border",
                  explLang === lang.id 
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                {lang.label}
                {explLang === lang.id && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 lg:p-8 rounded-3xl bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <Bell className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-extrabold text-slate-900">{t('notifications')}</h2>
          </div>
          
          <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <div className="text-slate-900 font-bold text-lg">{t('notifications')}</div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={clsx(
                "w-14 h-8 rounded-full p-1 transition-colors relative shadow-inner",
                notifications ? "bg-amber-500" : "bg-slate-300"
              )}
            >
              <div className={clsx(
                "w-6 h-6 bg-white rounded-full transition-transform absolute top-1 shadow-sm",
                notifications ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 lg:p-8 rounded-3xl bg-white border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <Moon className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-extrabold text-slate-900">{t('density', { defaultMessage: 'Interface Density' })}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'normal', label: t('densityNormal', { defaultMessage: 'Normal' }) },
              { id: 'compact', label: t('densityCompact', { defaultMessage: 'Compact' }) }
            ].map(d => (
              <button 
                key={d.id}
                onClick={() => setDensity(d.id)}
                className={clsx(
                  "px-5 py-4 rounded-xl font-bold transition-all text-left flex items-center justify-between border",
                  density === d.id 
                    ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95 text-lg">
          <Save className="w-5 h-5" />
          {t('save')}
        </button>
      </div>
    </div>
  );
}
