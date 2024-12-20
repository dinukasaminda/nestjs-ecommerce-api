import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'node:domain';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const found = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (found) {
      throw new Error('User already exists');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 11);
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
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
