export class UserMainEntity {
  displayName: string = '';
  email: string = '';
  passwordHash: string = '';
  createdAt: Date = new Date();
}

export class UserEntity extends UserMainEntity {
  githubId: string = '';
  githubToken: string = '';
}

export class LoginEntity {
  token: string = '';
  displayName: string = '';
  email: string = '';
  avatarUrl: string = '';
}
