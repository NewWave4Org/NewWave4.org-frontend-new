'use client';
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'large',
  className = '',
  ...props
}) => {
  let buttonStyle =
    'rounded-lg focus:outline-none disabled:cursor-not-allowed w-fit ';

  // Type styles
  if (variant === 'primary') {
    buttonStyle +=
      'bg-buttons-cta-active text-font-primary hover:bg-buttons-cta-hover active:bg-primary-700 active:text-font-white disabled:bg-icons-grey disabled::text-font-white ';
  } else if (variant === 'secondary') {
    buttonStyle +=
      'border border-solid border-primary-500 text-primary-500 hover:bg-primary-400 hover:border-0 hover:text-font-white active:bg-primary-500 active:text-font-white disabled:bg-icons-grey disabled::text-font-white ';
  } else if (variant === 'tertiary') {
    buttonStyle +=
      'bg-transparent text-primary-500 hover:text-primary-700 active:text-primary-700 disabled:text-icons-grey ';
  }

  // Size styles
  if (size === 'small') {
    buttonStyle += 'px-3 py-1.5 text-small1 ';
  } else if (size === 'medium') {
    buttonStyle += 'px-4 py-2.5 text-medium1 ';
  } else if (size === 'large') {
    buttonStyle += 'px-6 py-4 text-medium1 h-[56px] ';
  }

  return (
    <button className={`${buttonStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
