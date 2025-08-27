export interface UserInfoResponseDTO {
  email: string;
  isActive: boolean;
  name: string;
  referenceId: string;
  roles: string[];
  createdAt: string | null;
  verificatedUser: boolean;
}
