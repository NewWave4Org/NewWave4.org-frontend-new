'use client';

import { useField, useFormikContext } from 'formik';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';
import ArrowUp4Icon from '../icons/navigation/ArrowUp4Icon';
import { useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  required,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField(props);
  const [isOpen, setIsOpen] = useState(false);
  const { setFieldValue } = useFormikContext();
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find(o => o.value === field.value) || null,
  );
  const selectRef = useRef<HTMLDivElement>(null);

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setFieldValue(props.name, option.value);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={props.name}
          className={`block text-medium2 mb-1 text-grey-500
         }`}
        >
          {label}
          {required && (
            <span className="text-status-danger-500 text-body font-poppins">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <div
          ref={selectRef}
          className={`w-[275px] h-[56px] bg-white p-4 pr-6 text-medium2 text-font-primary rounded-lg border-0 ring-1 ring-grey-700 appearance-none
            focus:outline-none       
            hover:ring-2 hover:ring-grey-600
           ${
             meta.touched && meta.error
               ? 'border-red-500 focus:ring-red-500'
               : 'border-gray-300 focus:ring-blue-500'
           }`}
          onClick={handleClick}
          onBlur={handleBlur}
        >
          <span className="h-full flex items-center text-medium2 text-grey-700">
            {selectedOption?.label || placeholder || 'Select an option'}
          </span>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-[270px] mt-1 bg-white rounded-md shadow-lg">
            {options.map(option => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}

        {isOpen ? (
          <ArrowUp4Icon
            size="20px"
            color="#7A7A7A"
            className="absolute left-[240px] top-1/2 -translate-y-1/2 pointer-events-none"
          />
        ) : (
          <ArrowDown4Icon
            size="20px"
            color="#7A7A7A"
            className="absolute left-[240px] top-1/2 -translate-y-1/2 pointer-events-none"
          />
        )}
      </div>

      {meta.touched && meta.error && (
        <p className="text-sm text-red-500 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default Select;
