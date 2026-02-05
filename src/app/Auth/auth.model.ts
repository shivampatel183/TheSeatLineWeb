export class LoginEntity {
  token: string = '';
  refreshToken: string = '';
  email: string = '';
  fullName: string = '';
}

export class RegisterEntity {
  fullName: string = '';
  email: string = '';
  password: string = '';
}

export class GoogleLoginEntity {
  idToken: string = '';
}
