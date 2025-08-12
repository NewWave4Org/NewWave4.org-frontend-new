function InactiveLink() {
  return (
    <>
      <h2 className="text-xl text-admin-700 mb-5">
        The password reset link has expired
      </h2>
      <p className="text-admin-700 text-medium">
        Please contact your administrator to send you a new invitation.
      </p>
    </>
  );
}

export default InactiveLink;
