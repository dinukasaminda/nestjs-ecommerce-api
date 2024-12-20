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
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Preference]),
  ],
  controllers: [UserController, PreferencesController],
  providers: [AuthService, UserService, PreferencesService],
})
export class AppModule {}
