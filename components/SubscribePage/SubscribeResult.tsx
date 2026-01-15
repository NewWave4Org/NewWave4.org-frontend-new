"use client";

import { confirmSubscribe } from "@/store/froms/action";
import { useAppDispatch } from "@/store/hook";
import { useEffect, useState } from "react";
import SubscribeResultChecking from "./checking/SubscribeResultChecking";
import SubscribeResultSuccess from "./success/SubscribeResultSuccess";
import SubscribeResultFailed from "./failed/SubscribeResultFailed";

function SubscribeResult({token}: {token: string | null}) {
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchSubscribeResult() {
      if(token) {
        try {
          await dispatch(confirmSubscribe(token)).unwrap();
          setStatus('success');
        } catch (error: any) {
          setStatus('error');
          setErrorMessage(error?.original?.errors[0]);
          console.log('fetchSubscribeResult', error);
        }
      }
    }

    fetchSubscribeResult();
    
  }, [token, dispatch]);

  return (
    <div className="container mx-auto px-4">
      {status === 'idle' && <SubscribeResultChecking />}
      {status === 'success' && <SubscribeResultSuccess />}
      {status === 'error' && <SubscribeResultFailed errorMessage={errorMessage} />}
    </div>
  );
}

export default SubscribeResult;