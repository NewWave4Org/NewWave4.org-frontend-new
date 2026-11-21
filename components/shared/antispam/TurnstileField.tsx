'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useEffect, useRef } from 'react';
import { getPublicEnv } from '@/utils/runtime-env';

const siteKey = (): string | undefined =>
  getPublicEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY');

/** Read at call time so the runtime-injected key (and tests) are honoured. */
export const isTurnstileEnabled = (): boolean => Boolean(siteKey());

interface TurnstileFieldProps {
  value: string;
  onChange: (token: string) => void;
}

const TurnstileField = ({ value, onChange }: TurnstileFieldProps) => {
  const ref = useRef<TurnstileInstance>(null);
  const previous = useRef(value);

  // Tokens are single-use: when the form clears a spent token, get a fresh one.
  useEffect(() => {
    if (previous.current && value === '') ref.current?.reset();
    previous.current = value;
  }, [value]);

  const key = siteKey();
  if (!key) return null;

  return (
    <Turnstile
      ref={ref}
      siteKey={key}
      onSuccess={onChange}
      onExpire={() => onChange('')}
      onError={() => onChange('')}
      options={{ appearance: 'interaction-only', size: 'flexible' }}
    />
  );
};

export default TurnstileField;
