import React from 'react';

const CloseIcon = ({size='16', color='#2A4365'}: {size?: string, color?: string}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L8 8M13 13L8 8M8 8L13 3L3 13" stroke={color} strokeWidth="2"/>
    </svg>
  );
};

export default CloseIcon;