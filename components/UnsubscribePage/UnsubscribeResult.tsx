'use client';

import { confirmUnsubscribe } from '@/store/froms/action';
import { useAppDispatch } from '@/store/hook';
import React, { useEffect, useState } from 'react';
import UnsubscribeResultChecking from './checking/UnsubscribeResultChecking';
import UnsubscribeResultSuccess from './success/UnsubscribeResultSuccess';
import UnsubscribeResultFailed from './failed/UnsubscribeResultFailed';

function UnsubscribeResult({id}: {id: string}) {
  
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchUnsubscribeResult() {
      if(id) {
        try {
          await dispatch(confirmUnsubscribe(id)).unwrap();
          setStatus('success');
        } catch (error: any) {
          setStatus('error');
          setErrorMessage(error?.original?.errors[0]);
          console.log('fetchUnsubscribeResult', error);
        }
      }
    }

    fetchUnsubscribeResult();
    
    }, [id, dispatch]);

  return (
    <div className="container mx-auto px-4">
      {status === 'idle' && <UnsubscribeResultChecking />}
      {status === 'success' && <UnsubscribeResultSuccess />}
      {status === 'error' && <UnsubscribeResultFailed errorMessage={errorMessage} />}
    </div>
  );
}

export default UnsubscribeResult;