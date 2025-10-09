import { Prisma, ProProfile } from '@prisma/client';
import { CreateProProfileDTO, UpdateProProfileDTO } from './pro-profile.types';
import { IProProfileRepository } from './pro-profile.repository';
import { UserRepository } from '../users';
import { NotFoundError, ConflictError } from '../../shared/types/errors';

export interface IProProfileService {
  createProfile(data: CreateProProfileDTO): Promise<ProProfile>;
  updateProfile(id: string, data: UpdateProProfileDTO): Promise<ProProfile>;
  deleteProfile(id: string): Promise<ProProfile>;
  findById(id: string): Promise<ProProfile | null>;
  findByUserId(userId: string): Promise<ProProfile | null>;
  findMany(filter?: Prisma.ProProfileWhereInput): Promise<ProProfile[]>;
}

export class ProProfileService implements IProProfileService {
  constructor(
    private proProfileRepository: IProProfileRepository,
    private userRepository: UserRepository,
  ) {}

  async createProfile(data: CreateProProfileDTO): Promise<ProProfile> {
    const user = await this.userRepository.findById(data.userId);
    if (!user) throw new NotFoundError('User not found');

    const existingProfile = await this.proProfileRepository.findMany({
      userId: data.userId,
    });

    if (existingProfile.length > 0) throw new ConflictError(`Pro profile already exists for user ${data.userId}`);

    return await this.proProfileRepository.create(data);
  }

  async updateProfile(id: string, data: UpdateProProfileDTO): Promise<ProProfile> {
    return await this.proProfileRepository.update(id, data);
  }

  async deleteProfile(id: string): Promise<ProProfile> {
    return await this.proProfileRepository.delete(id);
  }

  async findById(id: string): Promise<ProProfile | null> {
    return await this.proProfileRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<ProProfile | null> {
    const profiles = await this.proProfileRepository.findMany({ userId });
    return profiles[0] || null;
  }

  async findMany(filter?: Prisma.ProProfileWhereInput): Promise<ProProfile[]> {
    return await this.proProfileRepository.findMany(filter);
  }
}
