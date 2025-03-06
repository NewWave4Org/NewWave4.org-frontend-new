import theme from '@/tailwind.config';

const ArrowRightIcon = ({
  size = '24',
  color = theme.theme.extend.colors.icons.active,
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
        d="M4 11.7257C4 11.346 4.28215 11.0322 4.64823 10.9826L4.75 10.9757H19.75C20.1642 10.9757 20.5 11.3115 20.5 11.7257C20.5 12.1054 20.2178 12.4192 19.8518 12.4689L19.75 12.4757L4.75 12.4757C4.33579 12.4757 4 12.1399 4 11.7257Z"
        fill={color}
      />
      <path
        d="M13.1739 6.23278C12.8804 5.94051 12.8794 5.46564 13.1717 5.17212C13.4373 4.90528 13.854 4.88018 14.148 5.0974L14.2323 5.16983L20.2823 11.1938C20.5499 11.4603 20.5743 11.8784 20.3553 12.1725L20.2824 12.2567L14.2324 18.2817C13.9389 18.574 13.464 18.573 13.1717 18.2795C12.906 18.0127 12.8826 17.596 13.1011 17.3028L13.1739 17.2189L18.6899 11.725L13.1739 6.23278Z"
        fill={color}
      />
    </svg>
  );
};

export default ArrowRightIcon;
