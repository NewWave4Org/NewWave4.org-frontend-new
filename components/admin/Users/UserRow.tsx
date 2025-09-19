import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import EmailIcon from '@/components/icons/symbolic/EmailIcon';
import Button from '@/components/shared/Button';
import DropDown from '@/components/shared/DropDown';
import { useEffect, useState } from 'react';
import { UserRowProps } from './types/interface';
import { ROLES } from '@/data/admin/roles/Roles';

function UserRow({
  user,
  handleDeleteUser,
  handleEditUser,
  handleResetInvitation,
  currentUser,
}: UserRowProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const createdAtTimestamp = new Date(
      user.lastInvitationSentAt ?? user.createdAt,
    ).getTime();
    const timerEnd = createdAtTimestamp + 5 * 60 * 1000;
    const now = Date.now();
    return Math.max(0, Math.ceil((timerEnd - now) / 1000));
  });

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const isDisabled = remainingSeconds > 0;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(word => word[0]?.toUpperCase() ?? '')
        .join('')
    : '';

  const isSuperAdmin = user.roles.includes(ROLES.SUPER_ADMIN);

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
              ? role.replace('ROLE_', '').toLowerCase().replace('_', ' ')
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
        {user.email !== currentUser?.email && !isSuperAdmin && (
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
                <DropDown
                  renderBth={(_isOpen, toggle) => (
                    <Button
                      variant="tertiary"
                      onClick={toggle}
                      className=" !text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                    active:!text-admin-700 hover:shadow-lg duration-500"
                    >
                      <>
                        <div className="flex items-center">
                          <div className="mr-1">
                            <EmailIcon />
                          </div>
                          Resend
                        </div>
                        <span className="mx-1">/</span>
                        <div className="flex items-center">
                          <div className="mr-1">
                            <EditIcon />
                          </div>
                          Edit
                        </div>
                      </>
                    </Button>
                  )}
                  items={[
                    {
                      label: `${
                        isDisabled
                          ? `You can resend in ${Math.floor(
                              remainingSeconds / 60,
                            )}:${(remainingSeconds % 60)
                              .toString()
                              .padStart(2, '0')}`
                          : 'Resend invitation'
                      }`,
                      onClick: () => {
                        if (isDisabled) {
                          return false;
                        } else {
                          handleResetInvitation(user);
                        }
                      },
                    },
                    {
                      label: 'Edit',
                      onClick: () => handleEditUser(user),
                    },
                  ]}
                />
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
}

export default UserRow;
