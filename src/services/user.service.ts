import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const found = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (found) {
      throw new Error('User already exists');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 11);
    const newUser = this.userRepository.create(createUserDto);
    const createdUser = this.userRepository.save(newUser);

    return plainToInstance(UserDto, createdUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async activateAccount(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    user.isVerified = true;
    await this.userRepository.save(user);
    return { message: 'Account activated successfully' };
  }
}
