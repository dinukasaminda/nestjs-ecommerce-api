import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponseProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { MessageDto } from 'src/dto/message.dto';
import { UserLoginResDto } from 'src/dto/user-login-response.dto';
import { UserLoginDto } from 'src/dto/user-login.dto';
import { UserVerifyDto } from 'src/dto/user-verify.dto';
import { UserDto } from 'src/dto/user.dto';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'User Registration',
    description:
      'Register a new user account. The user account will be created with the provided email and password.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'User already exists or invalid data',
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate User Account [Email Verification]',
    description:
      'This api is a dummy api to simulate the email verification process',
  })
  @ApiOkResponse({
    description: 'User account activated successfully',
    type: MessageDto,
  })
  @ApiBadRequestResponse({
    description: 'User not found',
  })
  activateAccount(@Body() userverifyDto: UserVerifyDto) {
    return this.userService.activateAccount(userverifyDto.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Login with the provided email and password',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: UserLoginResDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or account not activated',
  })
  login(@Body() loginDto: UserLoginDto): Promise<{
    accessToken: string;
  }> {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
