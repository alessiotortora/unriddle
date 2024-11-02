import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  console.log(user);

  if (user) {
    redirect('/dashboard');
  }

  return <div className="min-h-screen">{children}</div>;
}
