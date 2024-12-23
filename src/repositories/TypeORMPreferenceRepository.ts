import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preference } from 'src/entities/preference.entity';
import { PreferenceRepository } from './PreferenceRepository.interface';

@Injectable()
export class TypeORMPreferenceRepository implements PreferenceRepository {
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
  ) {}

  async findByUserIdAndName(
    userId: number,
    name: string,
  ): Promise<Preference | null> {
    return this.preferenceRepository.findOne({
      where: {
        user: { id: userId },
        name: name,
      },
    });
  }
  async findById(id: number): Promise<Preference | null> {
    return this.preferenceRepository.findOneBy({
      id: id,
    });
  }

  create(preference: Partial<Preference>): Preference {
    return this.preferenceRepository.create(preference);
  }

  async save(preference: Preference): Promise<Preference> {
    return this.preferenceRepository.save(preference);
  }

  async delete(id: number): Promise<{ affected?: number }> {
    return this.preferenceRepository.delete(id);
  }

  async findByUserId(userId: number): Promise<Preference[]> {
    return this.preferenceRepository.find({
      where: { user: { id: userId } },
    });
  }
}
