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
      const msg = extractErrorMessage(
        result.payload?.original?.errors || result.payload?.message,
      );
      setError(msg);
      throw new Error(msg);
    }

    const value = result.payload != null ? result.payload : true;

    return value;
  };
}

export default useHandleThunk;
