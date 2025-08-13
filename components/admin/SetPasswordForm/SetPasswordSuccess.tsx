import LinkBtn from '@/components/shared/LinkBtn';
import React from 'react';

function SetPasswordSuccess() {
  return (
    <>
      <div className="mb-10">
        <h2 className="text-xl text-admin-700 mb-5">
          Password successfully changed
        </h2>
        <p className="text-admin-700 text-medium">
          You can use the new password to login.
        </p>
      </div>
      <LinkBtn
        href="/admin"
        className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal w-full text-xl p-4 hover:opacity-[0.8] duration-500 flex justify-center"
      >
        Sing in
      </LinkBtn>
    </>
  );
}

export default SetPasswordSuccess;
