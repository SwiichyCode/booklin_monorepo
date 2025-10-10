import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default async function RequireAuthLayout({ children }: PropsWithChildren) {
  const { userId } = await auth();

  if (!userId) {
    const redirectUrl = new URL(window.location.href);
    const message = encodeURIComponent('Veuillez vous connecter pour accéder à cette page');
    const redirectTo = encodeURIComponent(redirectUrl.pathname);

    return redirect(`/sign-in?message=${message}&redirectTo=${redirectTo}`);
  }

  return <>{children}</>;
}
