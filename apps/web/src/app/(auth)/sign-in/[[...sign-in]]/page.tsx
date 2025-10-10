import { SignIn } from '@clerk/nextjs';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; redirectTo?: string }>;
}) {
  const { message, redirectTo } = await searchParams;

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignIn fallbackRedirectUrl={redirectTo} />
    </div>
  );
}
