"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { User, Shield, Users } from 'lucide-react';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Студент / Student');
  const [group, setGroup] = useState('');

  // Fallback to English for this MVP if translations missing in some contexts, but let's use direct strings here to ensure it works across all locales instantly or use translations if available.
  const t = useTranslations('Auth');

  useEffect(() => {
    // Check if user is already logged in
    const storedName = localStorage.getItem('ielts_user_name');
    if (!storedName) {
      setIsOpen(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('ielts_user_name', name.trim());
      localStorage.setItem('ielts_user_role', role);
      localStorage.setItem('ielts_user_group', group.trim());
      
      // Dispatch custom event to notify other components (like TopBar)
      window.dispatchEvent(new Event('ielts_login'));
      
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8 relative">
          <div className="logo-squircle mb-4">
            <span className="logo-text">ielts</span>
            <div className="logo-underline" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t('welcome', { defaultMessage: 'Welcome to IELTS Write' })}</h2>
          <p className="text-sm text-slate-400 mt-2 text-center">{t('subtitle', { defaultMessage: 'Please enter your details to continue' })}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">{t('fullName', { defaultMessage: 'Full Name / Аты-жөні' })} *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm"
                placeholder="Ivan Ivanov"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">{t('role', { defaultMessage: 'Role / Статус' })}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shield className="w-4 h-4 text-slate-500" />
              </div>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm appearance-none bg-black/30"
              >
                <option value="Оқушы / School Student">Оқушы / Школьник</option>
                <option value="Студент / Student">Студент / Student</option>
                <option value="Мұғалім / Teacher">Мұғалім / Педагог</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">{t('group', { defaultMessage: 'Class / Group (Optional)' })}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="w-4 h-4 text-slate-500" />
              </div>
              <input 
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-sm"
                placeholder="10 'A' / 2 course"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary-hover text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('loginButton', { defaultMessage: 'Кіру / Войти' })}
          </button>
        </form>
      </div>
    </div>
  );
}
