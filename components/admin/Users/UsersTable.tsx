'use client';

import UsersIcon from '@/components/icons/symbolic/UsersIcon';
import Button from '@/components/shared/Button';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import { openModal } from '@/components/ui/Modal/ModalSlice';
import Table from '@/components/ui/Table/Table';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getUserById } from '@/store/users/actions';
import { UserItem } from '@/utils/users/type/interface';
import { UsersProps } from './types/interface';
import { useCallback, useMemo, useState } from 'react';
import { resendInvitation } from '@/store/auth/action';
import { toast } from 'react-toastify';
import UserRow from './UserRow';
import { userUpdate } from '@/store/users/users_slice';

function UsersTable({ users }: UsersProps) {
  const [sortVal, setSortVal] = useState<'asc' | 'desc'>('asc');

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.authUser.user);

  const onlyContentManager =
    currentUser?.roles.length === 1 &&
    currentUser.roles[0] === 'ROLE_CONTENT_MANAGER';

  function handleDeleteUser(user: UserItem) {
    dispatch(
      openModal({
        modalType: ModalType.DELETEUSER,
        user: user,
      }),
    );
  }

  function handleEditUser(user: UserItem) {
    dispatch(openModal({ modalType: ModalType.EDITUSER }));
    dispatch(getUserById({ id: user.id }));
  }

  function handleResetInvitation(user: UserItem) {
    if (!user) return;
    const { id, email } = user;

    dispatch(resendInvitation({ email }))
      .unwrap()
      .then(() => {
        toast.success(`Invitation resent to ${email}`);

        dispatch(getUserById({ id }))
          .unwrap()
          .then(updatedUser => {
            dispatch(userUpdate(updatedUser));
          });
      })
      .catch(err => {
        console.log('errors', err.original.errors.toString());
        toast.error(
          err.original.errors.toString() || 'Failed to resend invitation',
        );
      });
  }

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aVal = a.verificatedUser ? 1 : 0;
      const bVal = b.verificatedUser ? 1 : 0;

      return sortVal === 'asc' ? bVal - aVal : aVal - bVal;
    });
  }, [users, sortVal]);

  const handleStatus = useCallback(() => {
    setSortVal(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <>
      <div className="users-manager">
        <Table
          classNameRow="bg-admin-100"
          data={sortedUsers}
          renderHeader={() => (
            <>
              <th className="pl-10 pb-4 px-2 border-b border-admin-300">
                Avatar
              </th>
              <th className="pb-4 px-2 border-b  border-admin-300">Name</th>
              <th className="pb-4 px-2 border-b  border-admin-300">Email</th>
              <th className="pb-4 px-2 border-b  border-admin-300">Role</th>
              <th className="pb-4 px-2 border-b  border-admin-300">
                <span onClick={() => handleStatus()} className="cursor-pointer">
                  Status
                  <span
                    className={
                      sortVal === 'asc' ? 'font-bold' : 'text-gray-400'
                    }
                  >
                    ↑
                  </span>
                  <span
                    className={
                      sortVal === 'desc' ? 'font-bold' : 'text-gray-400'
                    }
                  >
                    ↓
                  </span>
                </span>
              </th>
              <th className="pb-4 border-b  border-admin-300 flex justify-end">
                {!onlyContentManager && (
                  <Button
                    variant="primary"
                    className="flex text-font-white !bg-background-darkBlue px-[12px] py-[9px] h-auto min-w-[135px]"
                    onClick={() =>
                      dispatch(
                        openModal({ modalType: ModalType.CREATENEWUSER }),
                      )
                    }
                  >
                    <div className="mr-[12px]">
                      <UsersIcon color="#fff" />
                    </div>
                    Add new
                  </Button>
                )}
              </th>
            </>
          )}
          renderRow={user => (
            <UserRow
              key={`${user.id}-${user.lastInvitationSentAt}`}
              user={user}
              currentUser={currentUser}
              handleDeleteUser={handleDeleteUser}
              handleEditUser={handleEditUser}
              handleResetInvitation={handleResetInvitation}
            />
          )}
        />
      </div>
    </>
  );
}

export default UsersTable;
