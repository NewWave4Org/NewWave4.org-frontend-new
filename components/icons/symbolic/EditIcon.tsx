const EditIcon = ({size="24", color="#2A4365"}: {size?: string, color?: string}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.2633 3.59924L5.05327 12.2892C4.74327 12.6192 4.44327 13.2692 4.38327 13.7192L4.01327 16.9592C3.88327 18.1292 4.72327 18.9292 5.88327 18.7292L9.10327 18.1792C9.55327 18.0992 10.1833 17.7692 10.4933 17.4292L18.7033 8.73924C20.1233 7.23924 20.7633 5.52924 18.5533 3.43924C16.3533 1.36924 14.6833 2.09924 13.2633 3.59924Z" stroke={color} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.8906 5.05078C12.3206 7.81078 14.5606 9.92078 17.3406 10.2008" stroke={color} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 22H21" stroke={color} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default EditIcon;