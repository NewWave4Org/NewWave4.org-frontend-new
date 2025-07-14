import { useAppDispatch } from '@/store/hook';
import { extractErrorMessage } from './apiErrors';

function useHandleThunk() {
  const dispatch = useAppDispatch();

  return async function useHandleThunk<T>(
    thunkAction: any,
    args: T,
    setError: (msg: string) => void,
  ): Promise<any | true | null> {
    const result = await dispatch(thunkAction(args));

    if (thunkAction.rejected.match(result)) {
      console.log('result', result);
      const msg = extractErrorMessage(
        result.payload?.original?.errors || result.payload?.message,
      );
      setError(msg);
      return null;
    }

    const value = result.payload != null ? result.payload : true;
    console.log('✅ Thunk success, result:');
    return value;
  };
}

export default useHandleThunk;
