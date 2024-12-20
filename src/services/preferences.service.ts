import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddPreferenceDto } from 'src/dto/add-preferences.dto';
import { Preference } from 'src/entities/preference.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Preference)
    private readonly preferencesRepository: Repository<Preference>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Add a preference for a user if it doesn't already exist
   */
  async addPreference(
    userId: number,
    addPreferenceDto: AddPreferenceDto,
  ): Promise<Preference> {
    // Check if the preference already exists for the user
    const existingPreference = await this.preferencesRepository.findOne({
      where: {
        user: { id: userId },
        name: addPreferenceDto.preference,
      },
    });

    if (existingPreference) {
      throw new ConflictException('Preference already exists');
    }

    // Create and save the new preference
    const preference = this.preferencesRepository.create({
      name: addPreferenceDto.preference,
      user: { id: userId },
    });
    return this.preferencesRepository.save(preference);
  }

  /**
   * Remove a preference by ID
   */
  async removePreference(userId: number, id: number): Promise<void> {
    const preference = await this.preferencesRepository.findOne({
      where: {
        user: { id: userId },
        id: id,
      },
    });
    if (!preference) {
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
  async getUserPreferences(userId: number): Promise<Preference[]> {
    return this.preferencesRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
