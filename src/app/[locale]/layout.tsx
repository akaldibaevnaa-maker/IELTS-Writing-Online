import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AppLayout from '@/components/layout/AppLayout';
import LoginGateway from '@/components/auth/LoginGateway';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'cyrillic-ext'] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();
 
  return (
    <html lang={locale} translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body suppressHydrationWarning className={`${jakarta.className} bg-background text-foreground min-h-screen overflow-x-hidden relative flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <LoginGateway />
          <AppLayout>
            {children}
          </AppLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
