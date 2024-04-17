import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);

    return {
      code: 200,
      status: 'success',
      data: result,
    };
  }
}
