
const PenIcon = ({size='20', color="#FFFCFE"}: {size?: string, color?: string}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 15.8333L15.8333 10L18.3333 12.5L12.5 18.3333L10 15.8333Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.9974 10.8327L13.7474 4.58268L1.66406 1.66602L4.58073 13.7493L10.8307 14.9993L14.9974 10.8327Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66406 1.66602L7.98573 7.98768" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.16667 10.8333C10.0871 10.8333 10.8333 10.0871 10.8333 9.16667C10.8333 8.24619 10.0871 7.5 9.16667 7.5C8.24619 7.5 7.5 8.24619 7.5 9.16667C7.5 10.0871 8.24619 10.8333 9.16667 10.8333Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default PenIcon;