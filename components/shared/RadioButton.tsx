import { Field } from 'formik';
import React from 'react';

interface RadioButtonProps {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  value,
  checked,
  disabled = false,
  error,
}) => {
  return (
    <label
      className={`h-[45px] flex items-center gap-2 cursor-pointer text-medium2 text-font-primary ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Field type="radio" name={name} value={value} className="hidden" />
      <div
        className={`w-6 h-6 border rounded-full flex items-center justify-center ${
          error
            ? 'border-status-danger-500'
            : checked
            ? 'border-font-accent bg-font-accent'
            : 'border-grey-500'
        }`}
      >
        {checked && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
      </div>
      <span className="text-medium2 text-font-primary flex items-baseline">
        {label}
      </span>
    </label>
  );
};

export default RadioButton;
