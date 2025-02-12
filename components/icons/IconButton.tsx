import React from 'react';
import Link from 'next/link';

interface IconButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  size?: '32px' | '56px';
  isSocial?: boolean;
  href: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  size = '32px',
  isSocial = false,
  className,
  href,
  ...props
}) => {
  const sizes = {
    '32px': 'w-8 h-8',
    '56px': 'w-14 h-14',
  };

  return (
    <Link
      href={href}
      className={`flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-0 active:ring-0 ${
        sizes[size]
      } ${className || ''} 
        ${isSocial ? '' : 'hover:text-gray-500 disabled:text-gray-300'}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default IconButton;
