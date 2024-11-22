import type { Metadata } from 'next';

import { DialogProvider } from '@/components/providers/dialog-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import UserProvider from '@/components/providers/user-provider';
import { Toaster } from '@/components/ui/sonner';
import { getUser } from '@/lib/actions/get-user';

import './globals.css';

export const metadata: Metadata = {
  title: 'Boring CMS',
  description: 'by unriddle',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider initialUser={user}>{children}</UserProvider>
          <DialogProvider />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
