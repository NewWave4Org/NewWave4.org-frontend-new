import React from 'react';
import { prefix } from '@/utils/prefix';

const List = ({ items } : { items : string[]}) => {
  return (
    <ul className="space-y-4">
      {items.map((item: string, index: number) => (
        <li 
          key={index} 
          className="text-font-primary sm:justify-start text-base font-normal leading-[150%] pl-10 relative before:content-[''] before:absolute before:left-0 before:top-[5px] before:w-8 before:h-8 before:bg-no-repeat before:bg-contain list-bg-before-image"
          style={{ 
            '--list-before-bg-image': `url(${prefix}/icons/success-list.svg)` 
          } as React.CSSProperties}
        >
          {item}
        </li>
      ))}
  </ul>
  );
};

export default List;