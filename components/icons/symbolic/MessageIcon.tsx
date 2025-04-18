import theme from '@/tailwind.config';

const MessageIcon = ({
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
        d="M11.7758 13.465C11.1068 13.465 10.4398 13.244 9.88176 12.802L5.39676 9.18599C5.07376 8.92599 5.02376 8.45299 5.28276 8.13099C5.54376 7.80999 6.01576 7.75899 6.33776 8.01799L10.8188 11.63C11.3818 12.076 12.1748 12.076 12.7418 11.626L17.1778 8.01999C17.4998 7.75699 17.9718 7.80699 18.2338 8.12899C18.4948 8.44999 18.4458 8.92199 18.1248 9.18399L13.6808 12.796C13.1188 13.242 12.4468 13.465 11.7758 13.465Z"
        fill={color}
      />
      <mask
        id="mask0_1839_6537"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="1"
        y="2"
        width="22"
        height="20"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1 2H22.4999V21.5H1V2Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_1839_6537)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.839 20H16.659C16.661 19.998 16.669 20 16.675 20C17.816 20 18.828 19.592 19.604 18.817C20.505 17.92 21 16.631 21 15.188V8.32C21 5.527 19.174 3.5 16.659 3.5H6.841C4.326 3.5 2.5 5.527 2.5 8.32V15.188C2.5 16.631 2.996 17.92 3.896 18.817C4.672 19.592 5.685 20 6.825 20H6.839ZM6.822 21.5C5.279 21.5 3.901 20.94 2.837 19.88C1.652 18.698 1 17.032 1 15.188V8.32C1 4.717 3.511 2 6.841 2H16.659C19.989 2 22.5 4.717 22.5 8.32V15.188C22.5 17.032 21.848 18.698 20.663 19.88C19.6 20.939 18.221 21.5 16.675 21.5H16.659H6.841H6.822Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default MessageIcon;
