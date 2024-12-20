import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials during login
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  /**
   * Logs in the user and returns the JWT token
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUser(email, password);

    if (!user.isVerified) {
      throw new UnauthorizedException('Account is not verified');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }
  /**
   * Decodes and validates JWT token
   */
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
