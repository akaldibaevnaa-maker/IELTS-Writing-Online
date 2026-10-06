"use client";

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChevronDown, User, Info, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

export default function TopBar() {
  const t = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [showAuthor, setShowAuthor] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const name = localStorage.getItem('ielts_user_name');
      const isAdmin = localStorage.getItem('ielts_admin');
      if (isAdmin === 'true') {
        setUserName('Басқарушы / Мұғалім панелі: Жаналыкова Назерке Талгатовна');
      } else if (name) {
        setUserName(name);
      }
    };
    
    loadUser();
    window.addEventListener('ielts_login', loadUser);
    return () => window.removeEventListener('ielts_login', loadUser);
  }, []);

  const switchLocale = (newLocale: string) => {
    setLangMenuOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  const getLangBadge = (l: string) => {
    switch (l) {
      case 'ru': return { label: 'RU', name: 'Русский', flag: '🇷🇺' };
      case 'kk': return { label: 'KZ', name: 'Қазақша', flag: '🇰🇿' };
      default: return { label: 'EN', name: 'English', flag: '🇬🇧' };
    }
  };

  const currentLang = getLangBadge(locale);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 fixed top-0 w-full z-10 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer">
          <button className="p-2 -ml-2 text-slate-500 hover:text-slate-800" onClick={() => document.dispatchEvent(new CustomEvent('toggle_sidebar'))}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div className="logo-squircle" onClick={() => router.push('/')}>
            <span className="logo-text">ielts</span>
            <div className="logo-underline" />
          </div>
          <div onClick={() => router.push('/')}>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
              Writing
            </h1>
            <p className="text-[11px] text-slate-500 font-bold tracking-wide hidden md:block uppercase">{t('slogan', { defaultMessage: 'AI Examiner & Tutor' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAuthor(true)}
            className="hidden md:flex glass-button items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border-transparent hover:bg-slate-100"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Автор</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="glass-button flex items-center gap-2 text-sm font-bold text-slate-700 px-3 py-1.5 rounded-lg"
            >
              <span className="text-base">{currentLang.flag}</span>
              {currentLang.label}
              <ChevronDown className={clsx("w-4 h-4 text-slate-400 transition-transform", langMenuOpen && "rotate-180")} />
            </button>
            
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl py-2 overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-top-2">
                {(['en', 'kk', 'ru'] as const).map(l => {
                  const lang = getLangBadge(l);
                  return (
                    <button 
                      key={l}
                      onClick={() => switchLocale(l)} 
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base">{lang.flag}</span>
                      {lang.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button 
            onClick={() => router.push('/account')} 
            className="glass-button flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-primary transition-colors border-slate-200 bg-slate-50"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-700 hidden md:block max-w-[150px] truncate">
              {userName || 'Account'}
            </span>
          </button>
        </div>
      </header>

      {showAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative border border-slate-200">
            <button onClick={() => setShowAuthor(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Жоба туралы / О платформе</h2>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-3 mt-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Платформа авторы</p>
                  <p className="font-bold text-slate-800 text-lg">Жаналыкова Назерке Талгатовна</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Мәртебесі</p>
                  <p className="font-medium text-slate-700 text-sm">Педагог-сарапшы, педагогика ғылымдарының магистрі.</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Бағыты</p>
                  <p className="font-medium text-slate-700 text-sm">Инновациялық білім беру кешені (IELTS Writing Task 2 дайындық және AI-талдау жүйесі).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
