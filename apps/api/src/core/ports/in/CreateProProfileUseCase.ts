import { ProProfile } from '@/core/domain/entities/ProProfile';

export interface CreateProProfileCommand {
  userId: string;
  businessName?: string | null;
  bio?: string | null;
  profession?: string | null;
  siret?: string | null;
  corporateName?: string | null;
  legalForm?: string | null;
  legalStatus?: string | null;
  experience?: number | null;
  certifications?: string[];
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  radius?: number | null;
  photos?: string[];
}

export interface CreateProProfileUseCase {
  execute(command: CreateProProfileCommand): Promise<ProProfile>;
}
