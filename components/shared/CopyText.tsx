import { useState } from 'react';
import CopyIcon from '../icons/symbolic/CopyIcon';

const CopyText = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline group">
      <span className="text-body group-hover:text-icons-hover">{text}</span>
      <span
        onClick={handleCopy}
        className={`cursor-pointer ml-2 transition-opacity duration-200 ${
          copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {copied ? (
          <span className="inline-block text-small2 ml-3 text-font-primary transform -translate-y-[6px]">
            Copied
          </span>
        ) : (
          <CopyIcon className="inline-block" size="24px" />
        )}
      </span>
    </div>
  );
};

export default CopyText;
