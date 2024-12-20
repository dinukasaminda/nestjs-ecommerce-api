import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsDate } from 'class-validator';
import { Preference } from './preference.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  fullName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsDate()
  dateOfBirth: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  password: string;

  @OneToMany(() => Preference, (preference) => preference.user)
  preferences: Preference[];
}
