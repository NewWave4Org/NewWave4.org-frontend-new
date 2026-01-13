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

  useEffect(() => {
    async function fetchSubscribeResult() {
      if(token) {
        try {
          const result = await dispatch(confirmSubscribe(token)).unwrap();

          if(result?.success) {
            setStatus('success');
            console.log('fetchSubscribeResult success')
          } else {
            setStatus('error');
            console.log('fetchSubscribeResult failed')
          }
        } catch (error) {
          setStatus('error');
          console.log('fetchSubscribeResult', error)
        }
      }
    }

    fetchSubscribeResult()
    
  }, [token, dispatch])

  return (
    <div className="container mx-auto px-4">
      {status === 'idle' && <SubscribeResultChecking />}
      {status === 'success' && <SubscribeResultSuccess />}
      {status === 'error' && <SubscribeResultFailed />}
    </div>
  );
}

export default SubscribeResult;