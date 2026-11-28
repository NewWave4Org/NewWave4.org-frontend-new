'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { getPublicEnv } from '@/utils/runtime-env';

const siteKey = (): string | undefined =>
  getPublicEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY');

/** Read at call time so the runtime-injected key (and tests) are honoured. */
export const isTurnstileEnabled = (): boolean => Boolean(siteKey());

interface TurnstileFieldProps {
  value: string;
  onChange: (token: string) => void;
  /**
   * The widget failed (blocker, bad key/hostname, Cloudflare outage). Forms
   * use it to stop requiring a token so the backend decides instead of the
   * form dead-ending.
   */
  onError?: () => void;
}

const TurnstileField = ({ value, onChange, onError }: TurnstileFieldProps) => {
  const t = useTranslations();
  const ref = useRef<TurnstileInstance>(null);
  const previous = useRef(value);
  const [errored, setErrored] = useState(false);

  // Tokens are single-use: when the form clears a spent token, get a fresh one.
  useEffect(() => {
    if (previous.current && value === '') ref.current?.reset();
    previous.current = value;
  }, [value]);

  const key = siteKey();
  if (!key) return null;

  return (
    <>
      <Turnstile
        ref={ref}
        siteKey={key}
        onSuccess={token => {
          setErrored(false);
          onChange(token);
        }}
        onExpire={() => onChange('')}
        onError={() => {
          setErrored(true);
          onChange('');
          onError?.();
        }}
        options={{ appearance: 'interaction-only', size: 'flexible' }}
      />
      {errored && (
        <div className="text-small2 mt-[4px] text-status-danger-500">
          {t('forms_errors.captcha_unavailable')}
        </div>
      )}
    </>
  );
};

export default TurnstileField;
