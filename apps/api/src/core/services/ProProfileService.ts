import { injectable, inject } from 'tsyringe';
import { ProProfile, OnboardingStep } from '@/core/domain/entities/ProProfile';
import type { ProProfileRepository } from '@/core/ports/out/ProProfileRepository';
import type { CreateProProfileCommand } from '@/core/ports/in/CreateProProfileUseCase';
import type { UpdateProProfileCommand } from '@/core/ports/in/UpdateProProfileUseCase';
import type { DeleteProProfileCommand } from '@/core/ports/in/DeleteProProfileUseCase';
import type { ApproveProProfileCommand } from '@/core/ports/in/ApproveProProfileUseCase';
import type { RejectProProfileCommand } from '@/core/ports/in/RejectProProfileUseCase';
import type {
  ActivatePremiumCommand,
  RenewPremiumCommand,
  DeactivatePremiumCommand,
} from '@/core/ports/in/ManagePremiumUseCase';
import { NotFoundError, ValidationError } from '@/core/domain/errors/DomainError';

@injectable()
export class ProProfileService {
  constructor(
    @inject('ProProfileRepository')
    private readonly proProfileRepository: ProProfileRepository,
  ) {}

  // ========================================
  // CREATE
  // ========================================

  async createProProfile(command: CreateProProfileCommand): Promise<ProProfile> {
    // Check if user already has a pro profile
    const existingProfile = await this.proProfileRepository.findByUserId(command.userId);
    if (existingProfile) {
      throw new ValidationError('User already has a professional profile');
    }

    // Create the domain entity
    const proProfile = ProProfile.create({
      userId: command.userId,
      businessName: command.businessName,
      bio: command.bio,
      profession: command.profession,
      siret: command.siret,
      corporateName: command.corporateName,
      legalForm: command.legalForm,
      legalStatus: command.legalStatus,
      experience: command.experience,
      certifications: command.certifications,
      address: command.address,
      postalCode: command.postalCode,
      city: command.city,
      latitude: command.latitude,
      longitude: command.longitude,
      radius: command.radius,
      photos: command.photos,
    });

    // Persist to database
    return await this.proProfileRepository.create(proProfile);
  }

  // ========================================
  // UPDATE
  // ========================================

  async updateProProfile(command: UpdateProProfileCommand): Promise<ProProfile> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    // Update business info
    if (
      command.businessName !== undefined ||
      command.bio !== undefined ||
      command.profession !== undefined ||
      command.experience !== undefined
    ) {
      proProfile.updateBusinessInfo({
        businessName: command.businessName,
        bio: command.bio,
        profession: command.profession,
        experience: command.experience,
      });
    }

    // Update legal info
    if (
      command.siret !== undefined ||
      command.corporateName !== undefined ||
      command.legalForm !== undefined ||
      command.legalStatus !== undefined
    ) {
      proProfile.updateLegalInfo({
        siret: command.siret,
        corporateName: command.corporateName,
        legalForm: command.legalForm,
        legalStatus: command.legalStatus,
      });
    }

    // Update location
    if (
      command.address !== undefined ||
      command.postalCode !== undefined ||
      command.city !== undefined ||
      command.latitude !== undefined ||
      command.longitude !== undefined ||
      command.radius !== undefined
    ) {
      proProfile.updateLocation({
        address: command.address,
        postalCode: command.postalCode,
        city: command.city,
        latitude: command.latitude,
        longitude: command.longitude,
        radius: command.radius,
      });
    }

    // Update certifications
    if (command.certifications !== undefined) {
      proProfile.setCertifications(command.certifications);
    }

    // Update photos
    if (command.photos !== undefined) {
      proProfile.setPhotos(command.photos);
    }

    // Update onboarding step if provided
    if (command.onboardingStep !== undefined) {
      proProfile.setOnboardingStep(command.onboardingStep as OnboardingStep);
    }

    // Persist changes
    return await this.proProfileRepository.update(proProfile);
  }

  // ========================================
  // DELETE
  // ========================================

  async deleteProProfile(command: DeleteProProfileCommand): Promise<void> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    await this.proProfileRepository.delete(command.id);
  }

  // ========================================
  // GET / QUERY
  // ========================================

  async findById(id: string): Promise<ProProfile | null> {
    return await this.proProfileRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<ProProfile | null> {
    return await this.proProfileRepository.findByUserId(userId);
  }

  async findAll(filters?: {
    profession?: string;
    city?: string;
    isPremium?: boolean;
    validationStatus?: string;
    isActive?: boolean;
  }): Promise<ProProfile[]> {
    return await this.proProfileRepository.findAll(filters);
  }

  // ========================================
  // APPROVAL
  // ========================================

  async approveProProfile(command: ApproveProProfileCommand): Promise<ProProfile> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    // Use domain logic to approve
    proProfile.approve();

    // Persist changes
    return await this.proProfileRepository.update(proProfile);
  }

  async rejectProProfile(command: RejectProProfileCommand): Promise<ProProfile> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    // Use domain logic to reject
    proProfile.reject(command.reason);

    // Persist changes
    return await this.proProfileRepository.update(proProfile);
  }

  // ========================================
  // PREMIUM MANAGEMENT
  // ========================================

  async activatePremium(command: ActivatePremiumCommand): Promise<ProProfile> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    // Use domain logic to activate premium
    proProfile.activatePremium(command.durationInDays);

    // Persist changes
    return await this.proProfileRepository.update(proProfile);
  }

  async renewPremium(command: RenewPremiumCommand): Promise<ProProfile> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    // Use domain logic to renew premium
    proProfile.renewPremium(command.additionalDays);

    // Persist changes
    return await this.proProfileRepository.update(proProfile);
  }

  async deactivatePremium(command: DeactivatePremiumCommand): Promise<ProProfile> {
    const proProfile = await this.proProfileRepository.findById(command.id);
    if (!proProfile) {
      throw new NotFoundError('ProProfile', command.id);
    }

    // Use domain logic to deactivate premium
    proProfile.deactivatePremium();

    // Persist changes
    return await this.proProfileRepository.update(proProfile);
  }
}
