'use client';

import { useField, useFormikContext } from 'formik';
import ArrowDown4Icon from '../icons/navigation/ArrowDown4Icon';
import ArrowUp4Icon from '../icons/navigation/ArrowUp4Icon';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  name: string;
  useFormik?: boolean;
  label?: string;
  required?: boolean;
  placeholder?: string;
  labelIcon?: ReactNode;
  labelClass?: string;
  adminSelectClass?: boolean;
  parentClassname?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
  dropDownClass?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  useFormik = true,
  onChange,
  required,
  placeholder,
  labelIcon,
  labelClass,
  adminSelectClass,
  parentClassname,
  dropDownClass = '',
  defaultValue,
  ...props
}) => {
  // const [field, meta] = useField(props);
  // const { setFieldValue } = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  let field: any = {};
  let meta: any = {};
  let setFieldValue: any = () => {};

   const [localValue, setLocalValue] = useState(defaultValue || '');

  if (useFormik) {
    try {
      [field, meta] = useField(props);
      setFieldValue = useFormikContext()?.setFieldValue;
    } catch (err) {
      console.warn('Select: Formik context not found. Falling back to uncontrolled mode.');
      useFormik = false;
    }
  }

  const selectedOption = options.find(o =>
    useFormik ? o.value === field?.value : o.value === localValue
  );
 
  const handleOptionClick = (option: Option) => {
    if (useFormik) {
      setFieldValue?.(props.name, option.value);
    } else {
      setLocalValue(option.value);
      onChange?.({
        target: {
          name: props.name,
          value: option.value,
        },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  // const selectedOption = options.find(o => o.value === field.value);

  // const handleOptionClick = (option: Option) => {
  //   setFieldValue(props.name, option.value, false);
  //   setIsOpen(false);
  // };

  // const handleBlur = (e: React.FocusEvent) => {
  //   if (!selectRef.current?.contains(e.relatedTarget as Node)) {
  //     setIsOpen(false);
  //   }
  // };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={props.name}
          className={`block text-medium2 mb-1 text-grey-500
            ${labelIcon ? 'flex items-center' : ''}
            ${labelClass}
         `}
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
          className={`w-[275px] relative h-[56px] bg-transparent p-4 pr-6 text-medium2 text-font-primary rounded-lg border-0 ring-1 ring-grey-700 appearance-none
            focus:outline-none       
            hover:ring-2 hover:ring-grey-600
          ${parentClassname ? parentClassname : ''}
            ${adminSelectClass ? '!w-full !bg-background-light !ring-0' : ''}
           ${
             meta.touched && meta.error
               ? 'ring-status-danger-500'
               : 'ring-grey-700'
           }`}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={handleBlur}
        >
          <span className="h-full flex items-center text-medium2 text-grey-700">
            {selectedOption?.label || placeholder || 'Оберіть опцію'}
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
            ref={dropdownRef}
            className={`z-10 w-[256px] mt-1 bg-grey-50 rounded-lg shadow-custom 
              ${adminSelectClass ? '!w-full' : ''}
              ${dropDownClass ? dropDownClass : ''}
            `}
          >
            {options.map(option => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 text-medium2 text-font-primary cursor-pointer hover:bg-background-primary active:bg-background-secondary"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* {isOpen && <div style={{ height: '220px' }} />} */}

      {meta.touched && meta.error && (
        <p className={`text-small2 mt-[4px] text-status-danger-500`}>
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default Select;
