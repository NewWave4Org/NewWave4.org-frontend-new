'use client';

import { useId } from 'react';

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Spam trap: positioned off-screen rather than display:none (some bots skip
 * fields hidden that way), and removed from the a11y tree and tab order.
 * The input name is deliberately non-semantic and password/identity managers
 * are told to skip it: a name like "website" gets autofilled, and a filled
 * honeypot silently drops a real person's message. The Formik value and the
 * JSON field stay `website`; forms map the string through `onChange`.
 */
const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => {
  // Several forms (footer subscribe + page form) can share a page, so the id
  // must be unique.
  const id = useId();
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="nw_hp"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default HoneypotField;
