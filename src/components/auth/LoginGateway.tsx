"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LoginGateway() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem('ielts_user_name');
    const isAdmin = localStorage.getItem('ielts_admin');
    
    // If not logged in and not on the home page, redirect to home page
    if (!storedName && isAdmin !== 'true' && pathname !== '/') {
      router.replace('/');
    }
    
    // If logged in and on the home page, redirect to app
    if ((storedName || isAdmin === 'true') && pathname === '/') {
      router.replace(isAdmin === 'true' ? '/admin' : '/new-essay/step-1');
    }
  }, [pathname, router]);

  if (!mounted) return null;
  return null;
}
