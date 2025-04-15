'use client';

import Link from 'next/link';
import { useState } from 'react';

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
  classNameBtn: string;
  classNameItem: string;
}

const DropDown = ({
  label,
  items,
  classNameItem,
  classNameBtn,
  icon,
}: DropDownProps) => {
  const [selected, setSelected] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(item: DropDownItem) {
    setSelected(item.label);
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className={classNameBtn}>
        {icon && <span className="mr-1">{icon}</span>}
        {selected || label}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto animate-fadeIn">
          {items?.map(item => (
            <div key={item.label} className={classNameItem}>
              {item.isLink && item.href ? (
                <Link href={item.href} onClick={() => handleSelect(item)}>
                  {item.label}
                </Link>
              ) : (
                <div onClick={() => handleSelect(item)}>{item.label}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
