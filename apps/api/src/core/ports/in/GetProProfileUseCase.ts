import { ProProfile } from '@/core/domain/entities/ProProfile';

export interface GetProProfileUseCase {
  findById(id: string): Promise<ProProfile | null>;
  findByUserId(userId: string): Promise<ProProfile | null>;
  findAll(filters?: {
    profession?: string;
    city?: string;
    isPremium?: boolean;
    validationStatus?: string;
    isActive?: boolean;
  }): Promise<ProProfile[]>;
}
