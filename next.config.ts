import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['ielts-writing-platform-2026.loca.lt']
};

export default withNextIntl(nextConfig);
