import { ProProfile } from '@/core/domain/entities/ProProfile';

export interface RejectProProfileCommand {
  id: string;
  reason: string;
}

export interface RejectProProfileUseCase {
  execute(command: RejectProProfileCommand): Promise<ProProfile>;
}
