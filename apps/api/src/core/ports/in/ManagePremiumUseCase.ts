import { ProProfile } from '@/core/domain/entities/ProProfile';

export interface ActivatePremiumCommand {
  id: string;
  durationInDays: number;
}

export interface RenewPremiumCommand {
  id: string;
  additionalDays: number;
}

export interface DeactivatePremiumCommand {
  id: string;
}

export interface ManagePremiumUseCase {
  activatePremium(command: ActivatePremiumCommand): Promise<ProProfile>;
  renewPremium(command: RenewPremiumCommand): Promise<ProProfile>;
  deactivatePremium(command: DeactivatePremiumCommand): Promise<ProProfile>;
}
