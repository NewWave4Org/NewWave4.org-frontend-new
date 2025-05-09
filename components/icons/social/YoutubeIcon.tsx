const YoutubeIcon = ({
  size = '24',
  className,
}: {
  size?: string;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect x="6" y="7" width="12" height="11" fill="white" />
      <path
        d="M19.0155 3.50879H4.98449C2.23163 3.50879 0 5.74042 0 8.49328V15.5073C0 18.2602 2.23163 20.4918 4.98449 20.4918H19.0155C21.7684 20.4918 24 18.2602 24 15.5073V8.49328C24 5.74042 21.7684 3.50879 19.0155 3.50879ZM15.6445 12.3415L9.08177 15.4716C8.9069 15.555 8.7049 15.4275 8.7049 15.2338V8.77805C8.7049 8.58158 8.91221 8.45424 9.08744 8.54305L15.6502 11.8687C15.8453 11.9676 15.8419 12.2474 15.6445 12.3415Z"
        fill="#F61C0D"
      />
    </svg>
  );
};

export default YoutubeIcon;
