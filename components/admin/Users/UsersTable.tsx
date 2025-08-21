'use client';

import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import EditIcon from '@/components/icons/symbolic/EditIcon';
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
import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import { resendInvitation } from '@/store/auth/action';
import { toast } from 'react-toastify';

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

  function handleResetInvitation(email: string) {
    if (!email) return;
    dispatch(resendInvitation({ email }))
      .unwrap()
      .then(() => {
        toast.success(`Invitation resent to ${email}`);
      })
      .catch(err => {
        toast.error(err.message || 'Failed to resend invitation');
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
          renderRow={user => {
            const initials = user?.name
              ? user.name
                  .split(' ')
                  .map(word => word[0]?.toUpperCase() ?? '')
                  .join('')
              : '';
            return (
              <>
                <td className="pl-6 py-6">
                  <div className="bg-background-darkBlue text-font-white text-center w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold">
                    {initials}
                  </div>
                </td>
                <td className="py-6 px-2">
                  <div className="text-admin-700 text-small">{user?.name}</div>
                </td>
                <td className="py-6 px-2">
                  <div className="text-admin-700 text-small">{user?.email}</div>
                </td>
                <td className="py-6 px-2">
                  <div className="flex flex-wrap">
                    {user?.roles.map(role => {
                      const userRole = role.startsWith('ROLE_')
                        ? role
                            .replace('ROLE_', '')
                            .toLowerCase()
                            .replace('_', ' ')
                        : role.toLowerCase().replace('_', ' ');
                      return (
                        <span
                          key={userRole}
                          className="bg-background-darkBlue800_2 text-font-white font-bold px-[17px] py-[5px] rounded-[50px] text-small m-1 whitespace-nowrap"
                        >
                          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-2">
                  {user.verificatedUser ? (
                    <span className="bg-status-success-500 py-1.5 px-4 rounded-2xl text-white font-semibold whitespace-nowrap text-small">
                      Verified
                    </span>
                  ) : (
                    <span className="bg-red-600 py-1.5 px-4 rounded-2xl text-white font-semibold whitespace-nowrap text-small">
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="pr-6 py-6">
                  {user.email !== currentUser?.email && (
                    <div className="tableActions flex justify-end">
                      <div className="flex gap-x-5">
                        {user.verificatedUser ? (
                          <Button
                            variant="tertiary"
                            className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md 
                            active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                            onClick={() => handleEditUser(user)}
                          >
                            <div className="mr-1">
                              <EditIcon />
                            </div>
                            Edit
                          </Button>
                        ) : (
                          <Button
                            variant="tertiary"
                            className=" !text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                            active:!text-admin-700 hover:shadow-lg duration-500"
                            onClick={() => handleResetInvitation(user?.email)}
                          >
                            <div className="mr-1">
                              <EmailIcon />
                            </div>
                            Resend invitation
                          </Button>
                        )}

                        <Button
                          variant="tertiary"
                          className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                          active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <div className="mr-1">
                            <BasketIcon color="#FC8181" />
                          </div>
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </td>
              </>
            );
          }}
        />
      </div>
    </>
  );
}

export default UsersTable;
