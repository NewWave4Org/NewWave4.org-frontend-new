import ArrowDown4Icon from '@/components/icons/navigation/ArrowDown4Icon';
import ArrowUp4Icon from '@/components/icons/navigation/ArrowUp4Icon';
import React, { useState, useRef } from 'react';

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  name: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  labelIcon?: React.ReactNode;
  labelClass?: string;
  adminSelectClass?: boolean;
  parentClassname?: string;
  dropDownClass?: string;
}

const SelectLocal: React.FC<SelectProps> = ({
  options,
  name,
  value,
  onChange,
  placeholder,
  label,
  required,
  labelIcon,
  labelClass,
  adminSelectClass,
  parentClassname,
  dropDownClass = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => String(o.value) === String(value));

  const handleOptionClick = (option: Option) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className={`block text-medium2 mb-1 text-grey-500
            ${labelIcon ? 'flex items-center' : ''}
            ${labelClass ?? ''}`}
        >
          {labelIcon && <span className="mr-[10px]">{labelIcon}</span>}
          {label}
          {required && (
            <span className="text-status-danger-500 text-body"> *</span>
          )}
        </label>
      )}
      <div className="relative">
        <div
          ref={selectRef}
          tabIndex={0}
          className={`w-[275px] relative h-[56px] bg-transparent p-4 pr-6 text-medium2 text-font-primary rounded-lg border-0 ring-1 ring-grey-700 cursor-pointer
            focus:outline-none hover:ring-2 hover:ring-grey-600
            ${parentClassname ?? ''}
            ${adminSelectClass ? '!w-full !bg-background-light !ring-0' : ''}
          `}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={handleBlur}
        >
          <span className="h-full flex items-center text-medium2 text-grey-700">
            {selectedOption?.label || placeholder || 'Select option'}
          </span>

          {isOpen ? (
            <ArrowUp4Icon
              size="20px"
              color="#7A7A7A"
              className="absolute right-[15px] top-1/2 -translate-y-1/2 pointer-events-none"
            />
          ) : (
            <ArrowDown4Icon
              size="20px"
              color="#7A7A7A"
              className="absolute right-[15px] top-1/2 -translate-y-1/2 pointer-events-none"
            />
          )}
        </div>

        {isOpen && (
          <div
            className={`absolute z-10 w-[256px] mt-1 bg-grey-50 rounded-lg shadow-custom
              ${dropDownClass ?? ''}
              ${adminSelectClass ? '!w-full' : ''}
            `}
          >
            {options.map(option => (
              <div
                key={option.value}
                onMouseDown={() => handleOptionClick(option)}
                className={`px-4 py-2 text-medium2 text-font-primary cursor-pointer 
                  ${option.disabled
                    ? 'text-grey-400 cursor-not-allowed'
                    : 'hover:bg-background-primary active:bg-background-secondary'}
                `}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectLocal;
