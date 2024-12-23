import { User } from 'src/entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
  create(user: Partial<User>): User;
  save(user: User): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
