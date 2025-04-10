'use client';
import { InputHTMLAttributes } from 'react';
import CrossIcon from '../icons/navigation/CrossIcon';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  value: string;
  maxLength?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  icon?: boolean;
  onIconClick?: () => void;
  required?: boolean;
  validationText?: string;
  classname?: string;
  state?:
    | 'default'
    | 'hover'
    | 'filled'
    | 'active'
    | 'success'
    | 'error'
    | 'disabled';
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  value,
  maxLength = 50,
  onChange,
  icon = false,
  onIconClick,
  required = false,
  validationText = '',
  className,
  state = 'default',
  ...props
}) => {
  const getStateClasses = () => {
    if (state === 'error' || validationText)
      return 'ring-1 ring-status-danger-500';
    switch (state) {
      case 'hover':
        return 'ring-grey-600';
      case 'filled':
        return 'ring-grey-500';
      case 'active':
        return 'ring-status-info-500';
      case 'success':
        return 'ring-status-success-500';
      case 'disabled':
        return 'ring-1 ring-grey-300 cursor-not-allowed';
      default:
        return 'ring-1 ring-grey-700';
    }
  };

  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick();
    }
  };

  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`block text-medium2 mb-1 ${
            state === 'disabled' ? 'text-grey-300' : 'text-grey-500'
          }`}
        >
          {label}
          {required && (
            <span className="text-status-danger-500 text-body"> *</span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          className={`${className}  w-[264px] h-[56px] p-4 text-medium2 text-font-primary rounded-lg border-0 ring ${getStateClasses()} 
          focus:outline-none focus:ring-2 focus:ring-status-info-500        
          hover:ring-2 hover:ring-grey-600
          active:ring-status-info-500 bg-transparent
          ${validationText && 'ring-status-danger-500'}`}
          disabled={state === 'disabled'}
          {...props}
        />
        {icon && (
          <span
            onClick={handleIconClick}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <CrossIcon color="#7A7A7A" />
          </span>
        )}
      </div>
      {validationText && (
        <p className={`text-small2 mt-[4px] text-status-danger-500`}>
          {validationText}
        </p>
      )}
    </>
  );
};

export default Input;
