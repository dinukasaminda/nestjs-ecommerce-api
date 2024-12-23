import { Preference } from 'src/entities/preference.entity';

export interface PreferenceRepository {
  findByUserIdAndName(userId: number, name: string): Promise<Preference | null>;
  findById(id: number): Promise<Preference | null>;
  findByUserId(userId: number): Promise<Preference[]>;
  create(preference: Partial<Preference>): Preference;
  save(preference: Preference): Promise<Preference>;
  delete(id: number): Promise<{ affected?: number }>;
}

export const PREFERENCE_REPOSITORY = Symbol('PREFERENCE_REPOSITORY');
