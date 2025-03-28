'use client';
import Link from "next/link";
import { LinkHTMLAttributes, useState } from "react";
import ArrowRightIcon from "../icons/navigation/ArrowRightIcon";

interface LinkProps extends LinkHTMLAttributes<HTMLLinkElement> {
  children: React.ReactNode;
  classname?: string,
  href: string
}

function LinkWithArrow({href, className='', children}: LinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={href}
      className={`${className} inline-block px-[27px] py-[15px] rounded-lg border border-primary-500 min-h-[56px] bg-transparent 
        text-primary-500 hover:bg-primary-500 duration-500 hover:text-white hover:duration-500`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <span className="mr-1 text-medium1 inline-block mt-[-2px]">
          {children}
        </span>
        <div className="mt-[3px]">
          <ArrowRightIcon color={isHovered ? "white" : "#3D5EA7"}  size="20" className="hover:duration-500 duration-500"/>
        </div>
      </div>
    </Link>
  );
}

export default LinkWithArrow;