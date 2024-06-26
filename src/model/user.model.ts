export class RegisterUserRequest {
  name: string;
  username: string;
  password: string;
}

export class UserResponse {
  name: string;
  username: string;
  token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name: string;
  password: string;
}
