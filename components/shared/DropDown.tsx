'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface DropDownItem {
  label: string;
  href?: string;
  isLink?: boolean;
}

interface DropDownProps {
  label?: string;
  icon?: React.ReactNode;
  items?: DropDownItem[];
  placeholder?: string;
  classNameMenu?: string;
  classNameItem?: string;
  renderBth: (isOpen: boolean, toggle: () => void) => React.ReactNode;
}

const DropDown = ({
  items,
  classNameItem,
  classNameMenu,
  renderBth
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  function toggle() {
    setIsOpen(prev => !prev);
  }

  function closeDropDown() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutSide(e: MouseEvent) {
      if(dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
        closeDropDown();
      }
    }

    document.addEventListener('mousedown', handleClickOutSide);

    return() => document.removeEventListener('mousedown', handleClickOutSide);
  });

  return (
    <div className='relative' ref={dropDownRef}>
      {renderBth(isOpen, toggle)}

      {isOpen && (
        <div className={`absolute z-10 mt-2 bg-white border rounded-xl shadow-lg max-h-60 overflow-auto animate-fadeIn ${classNameMenu}`}>
          {items?.map(item => (
            <div key={item.label} className={classNameItem}>
              {item.isLink && item.href ? (
                <Link href={item.href} onClick={() => closeDropDown()} className='py-2 px-4 block border-b hover:text-admin-700'>
                  {item.label}
                </Link>
              ) : (
                <div onClick={() => closeDropDown()} className='py-2 px-4 border-b hover:text-admin-700 cursor-pointer'>{item.label}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
