'use client';

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: '32px' | '56px';
  isSocial?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  size = '32px',
  isSocial = false,
  className,
  ...props
}) => {
  const sizes = {
    '32px': 'w-8 h-8',
    '56px': 'w-14 h-14',
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-0 active:ring-0 ${
        sizes[size]
      } ${className || ''} 
        ${isSocial ? '' : 'hover:text-gray-500 disabled:text-gray-300'}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
