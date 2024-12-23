import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AddPreferenceDto } from '../dto/add-preferences.dto';
import { PreferenceDto } from '../dto/preferences.dto';
import {
  PREFERENCE_REPOSITORY,
  PreferenceRepository,
} from '../repositories/PreferenceRepository.interface';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../repositories/UserRepository.interface';

@Injectable()
export class PreferencesService {
  constructor(
    @Inject(PREFERENCE_REPOSITORY)
    private readonly preferencesRepository: PreferenceRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Add a preference for a user if it doesn't already exist
   */
  async addPreference(
    userId: number,
    addPreferenceDto: AddPreferenceDto,
  ): Promise<PreferenceDto> {
    // Ensure the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the preference already exists for the user
    const existingPreference =
      await this.preferencesRepository.findByUserIdAndName(
        userId,
        addPreferenceDto.preference,
      );

    if (existingPreference) {
      throw new ConflictException('Preference already exists');
    }

    // Create and save the new preference
    const preference = this.preferencesRepository.create({
      name: addPreferenceDto.preference,
      user,
    });
    const res = await this.preferencesRepository.save(preference);
    return plainToInstance(PreferenceDto, res);
  }

  /**
   * Remove a preference by ID
   */
  async removePreference(userId: number, id: number): Promise<void> {
    const preference = await this.preferencesRepository.findById(id);

    if (!preference || preference.user.id !== userId) {
      throw new NotFoundException('Preference not found');
    }

    const result = await this.preferencesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Preference not found');
    }
  }

  /**
   * Get all preferences for a user
   */
  async getUserPreferences(userId: number): Promise<PreferenceDto[]> {
    const res = await this.preferencesRepository.findByUserId(userId);
    return res.map((v) => plainToInstance(PreferenceDto, v));
  }
}
