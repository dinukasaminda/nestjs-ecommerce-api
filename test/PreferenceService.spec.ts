import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesService } from '../src/services/preferences.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import {
  PREFERENCE_REPOSITORY,
  PreferenceRepository,
} from '../src/repositories/PreferenceRepository.interface';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../src/repositories/UserRepository.interface';
import { AddPreferenceDto } from '../src/dto/add-preferences.dto';
import { PreferenceDto } from '../src/dto/preferences.dto';

describe('PreferencesService', () => {
  let preferencesService: PreferencesService;
  let preferencesRepositoryMock: Partial<PreferenceRepository>;
  let userRepositoryMock: Partial<UserRepository>;

  beforeEach(async () => {
    preferencesRepositoryMock = {
      findByUserIdAndName: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    userRepositoryMock = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferencesService,
        {
          provide: PREFERENCE_REPOSITORY,
          useValue: preferencesRepositoryMock,
        },
        {
          provide: USER_REPOSITORY,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    preferencesService = module.get<PreferencesService>(PreferencesService);
  });

  describe('addPreference', () => {
    it('should add a new preference for a user', async () => {
      const userId = 1;
      const addPreferenceDto: AddPreferenceDto = { preference: 'Dark Mode' };
      const mockUser = { id: userId };
      const mockPreference = { id: 1, name: 'Dark Mode', user: mockUser };

      userRepositoryMock.findById = jest.fn().mockResolvedValue(mockUser);
      preferencesRepositoryMock.findByUserIdAndName = jest
        .fn()
        .mockResolvedValue(null);
      preferencesRepositoryMock.create = jest
        .fn()
        .mockReturnValue(mockPreference);
      preferencesRepositoryMock.save = jest
        .fn()
        .mockResolvedValue(mockPreference);

      const result = await preferencesService.addPreference(
        userId,
        addPreferenceDto,
      );

      expect(result).toEqual(expect.any(PreferenceDto));
      expect(
        preferencesRepositoryMock.findByUserIdAndName,
      ).toHaveBeenCalledWith(userId, 'Dark Mode');
      expect(preferencesRepositoryMock.save).toHaveBeenCalledWith(
        mockPreference,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 1;
      const addPreferenceDto: AddPreferenceDto = { preference: 'Dark Mode' };

      userRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(
        preferencesService.addPreference(userId, addPreferenceDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if preference already exists', async () => {
      const userId = 1;
      const addPreferenceDto: AddPreferenceDto = { preference: 'Dark Mode' };
      const mockUser = { id: userId };
      const mockPreference = { id: 1, name: 'Dark Mode', user: mockUser };

      userRepositoryMock.findById = jest.fn().mockResolvedValue(mockUser);
      preferencesRepositoryMock.findByUserIdAndName = jest
        .fn()
        .mockResolvedValue(mockPreference);

      await expect(
        preferencesService.addPreference(userId, addPreferenceDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('removePreference', () => {
    it('should remove a preference by ID', async () => {
      const userId = 1;
      const preferenceId = 1;
      const mockPreference = {
        id: preferenceId,
        name: 'Dark Mode',
        user: { id: userId },
      };

      preferencesRepositoryMock.findById = jest
        .fn()
        .mockResolvedValue(mockPreference);
      preferencesRepositoryMock.delete = jest
        .fn()
        .mockResolvedValue({ affected: 1 });

      await preferencesService.removePreference(userId, preferenceId);

      expect(preferencesRepositoryMock.findById).toHaveBeenCalledWith(
        preferenceId,
      );
      expect(preferencesRepositoryMock.delete).toHaveBeenCalledWith(
        preferenceId,
      );
    });

    it('should throw NotFoundException if preference does not exist', async () => {
      const userId = 1;
      const preferenceId = 1;

      preferencesRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(
        preferencesService.removePreference(userId, preferenceId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if preference belongs to another user', async () => {
      const userId = 1;
      const preferenceId = 1;
      const mockPreference = {
        id: preferenceId,
        name: 'Dark Mode',
        user: { id: 2 },
      };

      preferencesRepositoryMock.findById = jest
        .fn()
        .mockResolvedValue(mockPreference);

      await expect(
        preferencesService.removePreference(userId, preferenceId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserPreferences', () => {
    it('should return all preferences for a user', async () => {
      const userId = 1;
      const mockPreferences = [
        { id: 1, name: 'Dark Mode', user: { id: userId } },
        { id: 2, name: 'Notifications', user: { id: userId } },
      ];

      preferencesRepositoryMock.findByUserId = jest
        .fn()
        .mockResolvedValue(mockPreferences);

      const result = await preferencesService.getUserPreferences(userId);

      expect(result).toHaveLength(mockPreferences.length);
      expect(preferencesRepositoryMock.findByUserId).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should return an empty array if user has no preferences', async () => {
      const userId = 1;

      preferencesRepositoryMock.findByUserId = jest.fn().mockResolvedValue([]);

      const result = await preferencesService.getUserPreferences(userId);

      expect(result).toEqual([]);
    });
  });
});
