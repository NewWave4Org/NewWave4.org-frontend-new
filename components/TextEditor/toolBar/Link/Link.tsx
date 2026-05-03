'use client';

import { CompositeDecorator } from "draft-js";
import { useLocale } from "next-intl";

const LinkComponent = ({ contentState, entityKey, children }: any) => {
  const { url } = contentState.getEntity(entityKey).getData();
  const locale = useLocale();

  const resolvedUrl = () => {
    if (url.startsWith('https')) return url;
    if (url.startsWith(`/${locale}`)) return url;
    return `/${locale}/${url.replace(/^\//, '')}`;
  };

  return (
    <a href={resolvedUrl()} title={resolvedUrl()} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline cursor-pointer">
      {children}
    </a>
  );
};

const linkStrategy = (contentBlock: any, callback: any, contentState: any) => {
  contentBlock.findEntityRanges(
    (char: any) => {
      const key = char.getEntity();
      return key !== null && contentState.getEntity(key).getType() === 'LINK';
    },
    callback
  );
};

export const decorator = new CompositeDecorator([
  { strategy: linkStrategy, component: LinkComponent }
]);