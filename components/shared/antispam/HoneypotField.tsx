'use client';

import { useId, type ChangeEventHandler } from 'react';

interface HoneypotFieldProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

/**
 * Spam trap: positioned off-screen rather than display:none (some bots skip
 * fields hidden that way), and removed from the a11y tree and tab order.
 */
const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => {
  // Several forms (footer subscribe + page form) can share a page, so the id
  // must be unique; `name` stays "website" because Formik keys off it.
  const id = useId();
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default HoneypotField;
