import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { AuthService } from '../src/services/auth.service';
import { UserService } from '../src/services/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser: any = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    isVerified: true,
  };

  const mockJwtToken = 'mockJwtToken';

  const mockUserService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if email and password are valid', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );

      // should compare with parameters password and hashed password
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid and user is verified', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken);

      const result = await authService.login('test@example.com', 'password');

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(result).toEqual({ accessToken: mockJwtToken });
    });

    it('should throw UnauthorizedException if user is not verified', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(unverifiedUser);

      await expect(
        authService.login('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      // also check message
      try {
        await authService.login('test@example.com', 'password');
      } catch (error) {
        expect(error.message).toBe('Account is not activated');
      }
    });
  });

  describe('validateToken', () => {
    it('should return the decoded token if valid', async () => {
      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ email: mockUser.email, sub: mockUser.id });

      const result = await authService.validateToken('validToken');

      expect(jwtService.verify).toHaveBeenCalledWith('validToken');
      expect(result).toEqual({ email: mockUser.email, sub: mockUser.id });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
