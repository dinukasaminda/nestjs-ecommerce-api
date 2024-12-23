import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/user.dto';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../repositories/UserRepository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const found = await this.userRepository.findOneByEmail(createUserDto.email);
    if (found) {
      throw new BadRequestException('User already exists');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 11);
    const newUser = this.userRepository.create(createUserDto);
    const createdUser = this.userRepository.save(newUser);

    return plainToInstance(UserDto, createdUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async activateAccount(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.isVerified = true;
    await this.userRepository.save(user);
    return { message: 'Account activated successfully' };
  }
}
