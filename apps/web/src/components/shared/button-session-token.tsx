'use client';
import { Button } from '@/components/ui/button';

export const ButtonSessionToken = ({ sessionToken }: { sessionToken: string }) => {
  return <Button onClick={() => navigator.clipboard.writeText(sessionToken)}>Copy Session Token</Button>;
};
