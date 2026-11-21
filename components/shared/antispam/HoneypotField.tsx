'use client';

import type { ChangeEventHandler } from 'react';

interface HoneypotFieldProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

/**
 * Spam trap: positioned off-screen rather than display:none (some bots skip
 * fields hidden that way), and removed from the a11y tree and tab order.
 */
const HoneypotField = ({ value, onChange }: HoneypotFieldProps) => (
  <div
    aria-hidden="true"
    className="absolute -left-[9999px] h-px w-px overflow-hidden"
  >
    <label htmlFor="website">Leave this field empty</label>
    <input
      id="website"
      name="website"
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default HoneypotField;
