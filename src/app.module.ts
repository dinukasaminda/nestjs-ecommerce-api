import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { PreferencesController } from './controllers/preferences.controller';
import { AuthService } from './services/auth.service';
import { PreferencesService } from './services/preferences.service';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { Preference } from './entities/preference.entity';
import { TypeORMUserRepository } from './repositories/TypeORMUserRepository';
import {
  USER_REPOSITORY,
  UserRepository,
} from './repositories/UserRepository.interface';
import { PREFERENCE_REPOSITORY } from './repositories/PreferenceRepository.interface';
import { TypeORMPreferenceRepository } from './repositories/TypeORMPreferenceRepository';
import { LoggingInterceptor } from './interceptors/RequestLogger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
      envFilePath: '.env', // Points to your .env file
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Preference],
      logging: false,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Preference]),
  ],
  controllers: [UserController, PreferencesController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeORMUserRepository,
    },
    {
      provide: PREFERENCE_REPOSITORY,
      useClass: TypeORMPreferenceRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AuthService,
    UserService,
    PreferencesService,
  ],
})
export class AppModule {}
