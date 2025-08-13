export interface ResetPasswordRequestDTO {
  email: string;
}

export interface CheckValidTokenDTO {
  token: string;
}

export interface ConfirmResetPasswordRequestDTO {
  token: string;
  password: string;
  repeatPassword: string;
}
