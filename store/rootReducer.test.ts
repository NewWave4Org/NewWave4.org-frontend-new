import { describe, expect, it } from 'vitest';
import rootReducer from './rootReducer';
import { logOutAuth } from './auth/action';
import { setAuthData } from './auth/auth_slice';

describe('rootReducer', () => {
  it('resets the entire state tree to its initial value on logOutAuth.fulfilled', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const dirtyState = rootReducer(initialState, setAuthData(undefined));

    expect(dirtyState.authUser.isAuthenticated).toBe(true);
    expect(dirtyState).not.toEqual(initialState);

    const resetState = rootReducer(dirtyState, { type: logOutAuth.fulfilled.type });

    expect(resetState).toEqual(initialState);
  });

  it('leaves state untouched for unrelated actions', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    const nextState = rootReducer(initialState, { type: 'some/unrelatedAction' });

    expect(nextState).toEqual(initialState);
  });
});
