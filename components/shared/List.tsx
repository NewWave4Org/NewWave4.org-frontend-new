import React from 'react';
import { prefix } from '@/utils/prefix';

const List = ({ items } : { items : string[]}) => {
  return (
    <ul style={{ listStyleImage: `url(${prefix}/icons/success-list.svg)` }} className="space-y-4 pl-10">
      {items.map((item: string, index: number) => (
        <li key={index} className="text-font-primary sm:justify-start text-base font-normal leading-[150%]">
          {item}
        </li>
      ))}
  </ul>
  );
};

export default List;