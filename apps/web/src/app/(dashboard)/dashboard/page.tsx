import { redirect } from 'next/navigation';

import { getFirstSpace } from '@/lib/actions/get/get-first-space';
import { getUser } from '@/lib/actions/get/get-user';

export default async function DashboardRedirectPage() {
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
