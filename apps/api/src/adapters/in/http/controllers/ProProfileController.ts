import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ZodError } from 'zod';
import { ProProfileService } from '@/core/services/ProProfileService';
import { ProProfile } from '@/core/domain/entities/ProProfile';
import { DomainError, NotFoundError, ValidationError } from '@/core/domain/errors/DomainError';
import {
  createProProfileSchema,
  updateProProfileSchema,
  rejectProProfileSchema,
  activatePremiumSchema,
  renewPremiumSchema,
  proProfileFiltersSchema,
} from '../validation/proProfile.validation';
import { UserService } from '@/core/services/UserService';

@injectable()
export class ProProfileController {
  constructor(
    // 👈 Injection des services
    @inject('ProProfileServiceInstance')
    @inject('UserServiceInstance')
    private readonly proProfileService: ProProfileService,
    private readonly userService: UserService,
  ) {}

  // ========================================
  // CREATE
  // ========================================

  async createProProfile(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = createProProfileSchema.parse(req.body);

      const proProfile = await this.proProfileService.createProProfile(validatedData);

      res.status(201).json({
        success: true,
        data: this.toDTO(proProfile),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================================
  // UPDATE
  // ========================================

  async updateProProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      // Validate input
      const validatedData = updateProProfileSchema.parse(req.body);

      const proProfile = await this.proProfileService.updateProProfile({
        id,
        ...validatedData,
      });

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================================
  // DELETE
  // ========================================

  async deleteProProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      await this.proProfileService.deleteProProfile({ id });

      res.status(200).json({
        success: true,
        message: 'ProProfile deleted successfully',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================================
  // GET / QUERY
  // ========================================

  async getProProfileById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id as string;

      const proProfile = await this.proProfileService.findByUserId(userId);

      if (!proProfile) {
        res.status(404).json({
          success: false,
          error: 'ProProfile not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getProProfileByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;

      const proProfile = await this.proProfileService.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllProProfiles(req: Request, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const filters = proProfileFiltersSchema.parse(req.query);

      const proProfiles = await this.proProfileService.findAll(filters);

      res.status(200).json({
        success: true,
        data: proProfiles.map(profile => this.toDTO(profile)),
        count: proProfiles.length,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================================
  // APPROVAL
  // ========================================

  async approveProProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const proProfile = await this.proProfileService.approveProProfile({ id });

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
        message: 'ProProfile approved successfully',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async rejectProProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      // Validate input
      const validatedData = rejectProProfileSchema.parse(req.body);

      const proProfile = await this.proProfileService.rejectProProfile({
        id,
        reason: validatedData.reason,
      });

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
        message: 'ProProfile rejected',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================================
  // PREMIUM MANAGEMENT
  // ========================================

  async activatePremium(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      // Validate input
      const validatedData = activatePremiumSchema.parse(req.body);

      const proProfile = await this.proProfileService.activatePremium({
        id,
        durationInDays: validatedData.durationInDays,
      });

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
        message: 'Premium activated successfully',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async renewPremium(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      // Validate input
      const validatedData = renewPremiumSchema.parse(req.body);

      const proProfile = await this.proProfileService.renewPremium({
        id,
        additionalDays: validatedData.additionalDays,
      });

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
        message: 'Premium renewed successfully',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deactivatePremium(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const proProfile = await this.proProfileService.deactivatePremium({ id });

      res.status(200).json({
        success: true,
        data: this.toDTO(proProfile),
        message: 'Premium deactivated successfully',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // ========================================
  // HELPERS
  // ========================================

  private toDTO(proProfile: ProProfile | null) {
    if (!proProfile) return null;

    return {
      id: proProfile.id,
      userId: proProfile.userId,
      businessName: proProfile.businessName,
      bio: proProfile.bio,
      profession: proProfile.profession,
      siret: proProfile.siret,
      corporateName: proProfile.corporateName,
      legalForm: proProfile.legalForm,
      legalStatus: proProfile.legalStatus,
      experience: proProfile.experience,
      certifications: proProfile.certifications,
      address: proProfile.address,
      postalCode: proProfile.postalCode,
      city: proProfile.city,
      latitude: proProfile.latitude,
      longitude: proProfile.longitude,
      radius: proProfile.radius,
      photos: proProfile.photos,
      onboardingStep: proProfile.onboardingStep,
      onboardingProgress: proProfile.onboardingProgress,
      validationStatus: proProfile.validationStatus,
      rejectionReason: proProfile.rejectionReason,
      isActive: proProfile.isActive,
      isPremium: proProfile.isPremium,
      subscriptionEnd: proProfile.subscriptionEnd,
      rating: proProfile.rating,
      reviewCount: proProfile.reviewCount,
      createdAt: proProfile.createdAt,
      updatedAt: proProfile.updatedAt,
      // Computed properties
      isOnboardingFinished: proProfile.isOnboardingFinished(),
      isApproved: proProfile.isApproved(),
      isPremiumActive: proProfile.isPremiumActive(),
      isPubliclyVisible: proProfile.isPubliclyVisible(),
      displayName: proProfile.getDisplayName(),
    };
  }

  private handleError(error: unknown, res: Response): void {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: formattedErrors,
      });
      return;
    }

    // Handle domain errors
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (error instanceof DomainError) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }

    // Handle unknown errors
    console.error('Unexpected error in ProProfileController:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
