import React from 'react';

function TokenExpired() {
  return (
    <>
      <div className="text-xl text-admin-700 mb-5">
        The password reset link has expired
      </div>
      <p className="text-admin-700 text-medium">
        Please contact your administrator to send you a new invitation.
      </p>
    </>
  );
}

export default TokenExpired;
