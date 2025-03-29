'use client';
import { Dispatch, SetStateAction, ReactNode } from 'react';
import Link from "next/link";
import { LinkHTMLAttributes } from "react";

interface LinkProps extends LinkHTMLAttributes<HTMLLinkElement> {
  children: ReactNode;
  classname?: string,
  href: string,
  setIsHovered?: Dispatch<SetStateAction<boolean>>
}

function LinkBtn({href, className='', children, setIsHovered}: LinkProps) {
  return (
    <Link
      href={href}
      className={`${className} inline-block py-[15px] rounded-lg border border-primary-500 min-h-[56px] bg-transparent 
        text-primary-500 hover:bg-primary-400 hover:border-primary-400 duration-500 hover:text-white hover:duration-500`}
        onMouseEnter={() => setIsHovered && setIsHovered(true)}
        onMouseLeave={() => setIsHovered && setIsHovered(false)}
    >
      <div className="flex items-center">
        {children}
      </div>
    </Link>
  );
}

export default LinkBtn;