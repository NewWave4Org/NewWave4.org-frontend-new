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
import { ROLES } from '@/data/admin/roles/Roles';

function UsersTable({ users }: UsersProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.authUser.user);

  const onlyContentManager =
    currentUser?.roles.length === 1 &&
    currentUser.roles[0] === 'ROLE_CONTENT_MANAGER';

  const isSuperAdmin = currentUser?.roles.includes('ROLE_SUPER_ADMIN');

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

  return (
    <>
      <div className="users-manager">
        <Table
          classNameRow="bg-admin-100"
          data={users}
          renderHeader={() => (
            <>
              <th className="pl-[45px] pb-4 border-b border-admin-300">
                Avatar
              </th>
              <th className="pb-4 border-b  border-admin-300">Name</th>
              <th className="pb-4 border-b  border-admin-300">Email</th>
              <th className="pb-4 border-b  border-admin-300">Role</th>
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
                <td className="flex justify-start pl-[45px] py-[25px]">
                  <div className="bg-background-darkBlue text-font-white text-center w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold">
                    {initials}
                  </div>
                </td>
                <td className="py-[25px]">
                  <div className="text-admin-700 text-small">{user?.name}</div>
                </td>
                <td className="py-[25px]">
                  <div className="text-admin-700 text-small">{user?.email}</div>
                </td>
                <td className="py-[25px]">
                  <div className="">
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
                          className="bg-background-darkBlue800_2 text-font-white font-bold px-[17px] py-[5px] rounded-[50px] text-small mr-2"
                        >
                          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="pr-[45px] py-[25px]">
                  {!user.roles.includes('ROLE_SUPER_ADMIN') && (
                    <div className="tableActions flex justify-end">
                      <div className="flex gap-x-[40px]">
                        <Button
                          className="bg-transparent !text-admin-700 !p-0 h-auto flex items-center font-bold 
                        hover:bg-transparent active:bg-transparent active:!text-admin-700"
                          onClick={() => handleEditUser(user)}
                        >
                          <div className="mr-[10px]">
                            <EditIcon />
                          </div>
                          Edit
                        </Button>
                        {user.email !== currentUser?.email && (
                          <Button
                            className="bg-transparent !text-admin-700 !p-0 h-auto flex items-center font-bold 
                          hover:bg-transparent active:bg-transparent active:!text-admin-700"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <div className="mr-[10px]">
                              <BasketIcon color="#FC8181" />
                            </div>
                            Delete
                          </Button>
                        )}
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
