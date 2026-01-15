function SubscribeResultFailed({errorMessage}: {errorMessage?: string}) {

  return (
    <h2 className="text-h2 text-font-primary font-ebGaramond my-12 text-center">
      {errorMessage 
        ? errorMessage
        : <>
          На жаль, сталася помилка.
          <br />
          Будь ласка, спробуйте ще раз.
        </>
      }
      
    </h2>
  );
}

export default SubscribeResultFailed;