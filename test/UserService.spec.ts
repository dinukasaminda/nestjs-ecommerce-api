import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '../src/services/user.service';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../src/repositories/UserRepository.interface';
import { CreateUserDto } from '../src/dto/create-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<UserRepository>;

  beforeEach(async () => {
    userRepositoryMock = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY, // Use the token
          useValue: userRepositoryMock, // Provide the mocked implementation
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should register a new user', async () => {
    const createUserDto: CreateUserDto = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: new Date(1995, 10, 1),
    };
    userRepositoryMock.findOneByEmail = jest.fn().mockResolvedValue(null);
    userRepositoryMock.create = jest.fn().mockReturnValue(createUserDto);
    userRepositoryMock.save = jest
      .fn()
      .mockResolvedValue({ ...createUserDto, id: 1 });

    const result = await userService.register(createUserDto);

    expect(result).toHaveProperty('id');
    expect(userRepositoryMock.findOneByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
  });

  it('should throw an error if user already exists', async () => {
    const createUserDto: CreateUserDto = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: new Date(1995, 10, 1),
    };
    userRepositoryMock.findOneByEmail = jest
      .fn()
      .mockResolvedValue(createUserDto);

    await expect(userService.register(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
