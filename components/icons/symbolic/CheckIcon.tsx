import theme from '@/tailwind.config';

const CheckIcon = ({
  size = '32',
  color = theme.theme.extend.colors.icons.hover,
  className,
}:{
  size?: string;
  color?: string;
  className?: string;
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6.67188 17.3334L12.0052 22.6667L25.3385 9.33337" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default CheckIcon;