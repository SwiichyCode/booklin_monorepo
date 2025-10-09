import { ProProfile } from '@/core/domain/entities/ProProfile';

export interface ApproveProProfileCommand {
  id: string;
}

export interface ApproveProProfileUseCase {
  execute(command: ApproveProProfileCommand): Promise<ProProfile>;
}
