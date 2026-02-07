export class ResponseEntity {
  token: string = '';
  refreshToken: string = '';
  email: string = '';
  fullName: string = '';
}

export class LoginEntity {
  email: string = '';
  password: string = '';
}

export class RegisterEntity {
  fullName: string = '';
  email: string = '';
  password: string = '';
}

export class GoogleLoginEntity {
  idToken: string = '';
}
