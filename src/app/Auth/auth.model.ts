export class ResponseEntity {
  accessToken: string = '';
  refreshToken: string = '';
  expiresAt: string = '';
  user: UserEntity = new UserEntity();
}

export class UserEntity {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
}

export class LoginEntity {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  mfaCode?: string;
}

export class RegisterEntity {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
}

export class GoogleLoginEntity {
  idToken: string = '';
}
