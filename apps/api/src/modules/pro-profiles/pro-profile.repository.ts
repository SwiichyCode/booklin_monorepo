import { prisma } from '../../lib/prisma';
import { Prisma, ProProfile } from '@prisma/client';
import { CreateProProfileDTO, UpdateProProfileDTO } from './pro-profile.types';

export interface IProProfileRepository {
  create(data: CreateProProfileDTO): Promise<ProProfile>;
  update(id: string, data: UpdateProProfileDTO): Promise<ProProfile>;
  delete(id: string): Promise<ProProfile>;
  findById(id: string): Promise<ProProfile | null>;
  findMany(filter?: Prisma.ProProfileWhereInput): Promise<ProProfile[]>;
}

export class ProProfileRepository implements IProProfileRepository {
  async create(data: CreateProProfileDTO): Promise<ProProfile> {
    return await prisma.proProfile.create({ data });
  }

  async update(id: string, data: UpdateProProfileDTO): Promise<ProProfile> {
    return await prisma.proProfile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ProProfile> {
    return await prisma.proProfile.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<ProProfile | null> {
    return await prisma.proProfile.findUnique({
      where: { id },
    });
  }

  async findMany(filter?: Prisma.ProProfileWhereInput): Promise<ProProfile[]> {
    return await prisma.proProfile.findMany({
      where: filter,
    });
  }
}
