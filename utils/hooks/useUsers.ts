import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { searchUsers } from '@/store/users/actions';

export function useUsers(isUserVerificated?: boolean) {
    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.users.users);

    useEffect(() => {
        dispatch(searchUsers(isUserVerificated));
    }, [dispatch, isUserVerificated]);

    const usersList = useMemo(
        () =>
            users.map(user => ({
                value: user.id,
                label: user.name,
            })),
        [users],
    );

    // console.log('usersList', usersList, usersList.map(u => typeof u.value));

    const currentUser = useAppSelector(state => state.authUser.user);
    const currentAuthor = users.find(user => user.name === currentUser?.name);

    return { users, usersList, currentUser, currentAuthor };
}
