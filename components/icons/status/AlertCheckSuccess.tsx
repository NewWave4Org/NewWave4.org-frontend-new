import React from 'react';

function AlertCheckSuccess({size='24', color="#55B938", className}: {size?: string, color?: string, className?: string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#clip0_5678_14665)">
      <path d="M21.7969 12.1094C21.7969 17.4597 17.4596 21.7969 12.1094 21.7969C6.7591 21.7969 2.42188 17.4597 2.42188 12.1094C2.42188 6.7591 6.7591 2.42188 12.1094 2.42188C17.4596 2.42188 21.7969 6.7591 21.7969 12.1094ZM10.9888 17.2388L18.1763 10.0513C18.4204 9.80727 18.4204 9.41152 18.1763 9.16746L17.2925 8.28359C17.0484 8.03949 16.6527 8.03949 16.4086 8.28359L10.5469 14.1452L7.81019 11.4086C7.56613 11.1645 7.17039 11.1645 6.92629 11.4086L6.04242 12.2924C5.79836 12.5365 5.79836 12.9322 6.04242 13.1763L10.1049 17.2388C10.349 17.4829 10.7447 17.4829 10.9888 17.2388Z" fill={color}/>
      </g>
      <defs>
      <clipPath id="clip0_5678_14665">
      <rect width="20" height="20" fill="white" transform="translate(2.10938 2.10938)"/>
      </clipPath>
      </defs>
    </svg>
  );
}

export default AlertCheckSuccess;