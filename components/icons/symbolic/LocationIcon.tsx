import theme from '@/tailwind.config';

const LocationIcon = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.25 8.5C11.285 8.5 10.5 9.285 10.5 10.251C10.5 11.216 11.285 12 12.25 12C13.215 12 14 11.216 14 10.251C14 9.285 13.215 8.5 12.25 8.5ZM12.25 13.5C10.458 13.5 9 12.043 9 10.251C9 8.458 10.458 7 12.25 7C14.042 7 15.5 8.458 15.5 10.251C15.5 12.043 14.042 13.5 12.25 13.5Z"
        fill={color}
      />
      <mask
        id="mask0_1839_6551"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="4"
        y="2"
        width="17"
        height="20"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 2H20.4995V21.5H4V2Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_1839_6551)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.25 3.5C8.528 3.5 5.5 6.557 5.5 10.313C5.5 15.092 11.124 19.748 12.25 19.996C13.376 19.747 19 15.091 19 10.313C19 6.557 15.972 3.5 12.25 3.5ZM12.25 21.5C10.456 21.5 4 15.948 4 10.313C4 5.729 7.701 2 12.25 2C16.799 2 20.5 5.729 20.5 10.313C20.5 15.948 14.044 21.5 12.25 21.5Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default LocationIcon;
