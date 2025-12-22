'use client';

import ArrowUp4Icon from '@/components/icons/navigation/ArrowUp4Icon';
import React, { ReactNode, useState } from 'react';

interface IAccordionProps {
  title: string;
  children: ReactNode;
  actions?: React.ReactNode;
  classNameTop?: string;
  initState?: boolean;
}

function Accordion({ title, children, actions, classNameTop, initState = false }: IAccordionProps) {
  const [isOpen, setIsOpen] = useState(initState);

  return (
    <div className="border rounded-lg">
      <div className={`${classNameTop} flex items-center justify-between shadow-custom`}>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex mr-0 w-full">
          <ArrowUp4Icon className={`${!isOpen ? 'rotate-90' : ''} mr-3 duration-500`} />
          {title}
        </button>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}

export default Accordion;
