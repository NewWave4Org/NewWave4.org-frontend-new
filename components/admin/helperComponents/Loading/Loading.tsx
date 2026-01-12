
import LogoAdmin from '@/components/layout/admin/Logo_admin';
import React from 'react';

function Loading() {
  return (
    <div className='absolute w-full h-full bg-[#edf2f70d] flex flex-col items-center justify-center'>
      <div className='flex flex-col justify-center'>
        <LogoAdmin />
        <div className='text-black font-semibold mt-5 text-center text-xl'>Loading...</div>
      </div>
    </div>
  );
}

export default Loading;