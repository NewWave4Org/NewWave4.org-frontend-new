'use client';

import UsersIcon from '@/components/icons/symbolic/UsersIcon';
import Button from '@/components/shared/Button';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import { openModal } from '@/store/modal/ModalSlice';
import Table from '@/components/ui/Table/Table';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getUserById } from '@/store/users/actions';
import { UserItem } from '@/utils/users/type/interface';
import { UsersProps } from './types/interface';

import { resendInvitation } from '@/store/auth/action';
import { toast } from 'react-toastify';
import UserRow from './UserRow';
import { userUpdate } from '@/store/users/users_slice';
import useSortTable from '@/utils/hooks/useSortTable';

const TableHeader = [
  { id: '1', title: 'Avatar' },
  { id: '2', title: 'Name' },
  { id: '3', title: 'Email' },
  { id: '4', title: 'Role' },
];

function UsersTable({ users }: UsersProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.authUser.user);

  const { sortVal, handleSort, sortedData } = useSortTable({
    data: users,
  });

  const onlyContentManager =
    currentUser?.roles.length === 1 &&
    currentUser.roles[0] === 'ROLE_CONTENT_MANAGER';

  function handleDeleteUser(user: UserItem) {
    dispatch(
      openModal({
        modalType: ModalType.DELETE_USER,
        payload: user,
      }),
    );
  }

  function handleEditUser(user: UserItem) {
    dispatch(openModal({ modalType: ModalType.EDIT_USER }));
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

  return (
    <>
      <div className="users-manager">
        <Table
          classNameRow="bg-admin-100"
          data={sortedData}
          renderHeader={() => (
            <>
              {TableHeader.map(({ id, title }) => (
                <th
                  key={id}
                  className={`${
                    id === '1' ? 'pl-6' : ''
                  } pb-4 px-2 border-b  border-admin-300`}
                >
                  {title}
                </th>
              ))}
              <th className="pb-4 px-2 border-b  border-admin-300">
                <span
                  onClick={() => handleSort('verificatedUser')}
                  className="cursor-pointer"
                >
                  Status
                  <span
                    className={`${
                      sortVal === 'asc'
                        ? 'font-bold border-admin-600'
                        : 'text-gray-400'
                    } p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}
                  >
                    ↑
                  </span>
                  <span
                    className={`${
                      sortVal === 'desc'
                        ? 'font-bold border-admin-600'
                        : 'text-gray-400'
                    } p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}
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
                        openModal({ modalType: ModalType.CREATE_NEW_USER }),
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
