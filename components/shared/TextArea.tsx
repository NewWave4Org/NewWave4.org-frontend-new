import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
  labelClass?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  className,
  labelClass,
  ...props
}) => {
  return (
    <div className="relative flex flex-col flex-1">
      <label
        htmlFor={id}
        className={`block text-medium2 text-grey-500 mb-1  ${labelClass} `}
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={`max-w-[544px] py-2 px-4 text-medium2 text-font-primary rounded-lg border-0 ring-1 ring-grey-700 
        ${className} 
        resize-none bg-transparent
        hover:ring-2 hover:ring-grey-600
        focus:outline-none focus:ring-2 focus:ring-status-info-500 `}
        {...props}
      />
    </div>
  );
};

export default TextArea;
