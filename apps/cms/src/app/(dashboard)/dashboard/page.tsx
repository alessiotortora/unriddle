import { redirect } from 'next/navigation';

import { getFirstSpace } from '@/lib/actions/get-first-space';
import { getUser } from '@/lib/actions/get-user';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const firstSpace = await getFirstSpace(user.id);

  if (!firstSpace) {
    redirect('/error');
  }

  redirect(`/dashboard/${firstSpace.id}`);
}
