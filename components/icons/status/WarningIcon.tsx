import theme from '@/tailwind.config';

const WarningIcon = ({
  size = '24',
  color = theme.theme.extend.colors.status.warning[500],
  className,
}: {
  size?: string;
  color?: string;
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
      <path
        d="M13 14H11V9H13V14ZM13 18H11V16H13V18ZM1 21H23L12 2L1 21Z"
        fill={color}
      />
    </svg>
  );
};

export default WarningIcon;
