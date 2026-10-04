"use client";

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { FileEdit, FileText, TrendingUp, Settings, User, LayoutDashboard, Users, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('ielts_admin') === 'true');
  }, []);

  const studentNav = [
    { name: t('newEssay', { defaultMessage: 'New Essay' }), href: '/new-essay/step-1', match: '/new-essay', icon: FileEdit },
    { name: t('myEssays', { defaultMessage: 'My Essays' }), href: '/my-essays', match: '/my-essays', icon: FileText },
    { name: t('myProgress', { defaultMessage: 'My Progress' }), href: '/progress', match: '/progress', icon: TrendingUp },
    { name: t('extraTasks', { defaultMessage: 'Extra Tasks' }), href: '/extra-tasks', match: '/extra-tasks', icon: BookOpen },
    { name: t('settings', { defaultMessage: 'Settings' }), href: '/settings', match: '/settings', icon: Settings },
    { name: t('myAccount', { defaultMessage: 'My Account' }), href: '/account', match: '/account', icon: User },
  ];

  const teacherNav = [
    { name: t('teacherDashboard', { defaultMessage: 'Dashboard' }), href: '/admin', match: '/admin', icon: LayoutDashboard },
    { name: t('teacherEssays', { defaultMessage: 'Review Essays' }), href: '/admin?tab=essays', match: '/admin?tab=essays', icon: FileText },
    { name: t('teacherProgress', { defaultMessage: 'Progress' }), href: '/admin?tab=progress', match: '/admin?tab=progress', icon: TrendingUp },
    { name: t('teacherStudents', { defaultMessage: 'Students List' }), href: '/admin?tab=students', match: '/admin?tab=students', icon: Users },
    { name: t('teacherSettings', { defaultMessage: 'Settings' }), href: '/admin?tab=settings', match: '/admin?tab=settings', icon: Settings },
  ];

  const navItems = isAdmin ? teacherNav : studentNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-64px)] flex flex-col p-4 fixed left-0 top-[64px] z-20 pointer-events-auto shadow-sm">
      <nav className="flex-1 space-y-2 mt-4">
        {navItems.map((item) => {
          // Special case for /admin so it doesn't match all /admin/* sub-routes unless intended
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.match);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden cursor-pointer active:scale-95',
                isActive 
                  ? 'bg-primary/5 text-primary border border-primary/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-md" />
              )}
              <item.icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
