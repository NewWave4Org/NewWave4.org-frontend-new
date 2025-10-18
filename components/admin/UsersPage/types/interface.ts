import { UserInfoResponseDTO } from '@/utils/auth/libs/types/UserInfoResponseDTO';
import { UserItem } from '@/utils/users/type/interface';

export interface UsersProps {
  users: UserItem[];
}

export interface UserRowProps {
  user: UserItem;
  handleDeleteUser: (user: UserItem) => void;
  handleEditUser: (user: UserItem) => void;
  handleResetInvitation: (user: UserItem) => void;
  currentUser: UserInfoResponseDTO | null;
}
