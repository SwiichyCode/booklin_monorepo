import { ValidationError } from '../errors/DomainError';

export enum OnboardingStep {
  ENTERPRISE_INFO = 'ENTERPRISE_INFO',
  PROFESSIONAL_INFO = 'PROFESSIONAL_INFO',
  LOCATION = 'LOCATION',
  MEDIA = 'MEDIA',
  COMPLETED = 'COMPLETED',
}

export enum ValidationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ProProfileProps {
  id: string;
  userId: string;
  businessName: string | null;
  bio: string | null;
  profession: string | null;
  experience: number | null;
  certifications: string[];
  address: string | null;
  postalCode: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  siret: string | null;
  corporateName: string | null;
  legalForm: string | null;
  legalStatus: string | null;
  onboardingStep: OnboardingStep;
  onboardingProgress: number;
  onboardingComplete: boolean;
  validationStatus: ValidationStatus;
  rejectionReason: string | null;
  isActive: boolean;
  photos: string[];
  isPremium: boolean;
  subscriptionEnd: Date | null;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProProfileProps {
  userId: string;
  businessName?: string | null;
  bio?: string | null;
  profession?: string | null;
  experience?: number | null;
  certifications?: string[];
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  radius?: number | null;
  siret?: string | null;
  corporateName?: string | null;
  legalForm?: string | null;
  legalStatus?: string | null;
  photos?: string[];
}

export class ProProfile {
  private constructor(private props: ProProfileProps) {}

  // ============================================
  // FACTORY METHODS
  // ============================================

  /**
   * Créer un nouveau profil professionnel
   */
  static create(data: CreateProProfileProps): ProProfile {
    // Validation userId
    if (!data.userId) {
      throw new ValidationError('User ID is required');
    }

    // Validation experience
    if (data.experience !== null && data.experience !== undefined && data.experience < 0) {
      throw new ValidationError('Experience cannot be negative');
    }

    // Validation radius
    if (data.radius !== null && data.radius !== undefined && data.radius < 0) {
      throw new ValidationError('Radius cannot be negative');
    }

    return new ProProfile({
      id: '', // Sera généré par la DB
      userId: data.userId,
      businessName: data.businessName ?? null,
      bio: data.bio ?? null,
      profession: data.profession ?? null,
      experience: data.experience ?? null,
      certifications: data.certifications ?? [],
      address: data.address ?? null,
      postalCode: data.postalCode ?? null,
      city: data.city ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      radius: data.radius ?? null,
      siret: data.siret ?? null,
      corporateName: data.corporateName ?? null,
      legalForm: data.legalForm ?? null,
      legalStatus: data.legalStatus ?? null,
      onboardingStep: OnboardingStep.ENTERPRISE_INFO,
      onboardingProgress: 0,
      onboardingComplete: false,
      validationStatus: ValidationStatus.PENDING,
      rejectionReason: null,
      isActive: false,
      photos: [],
      isPremium: false,
      subscriptionEnd: null,
      rating: null,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Reconstruire depuis la persistence (DB)
   */
  static fromPersistence(props: ProProfileProps): ProProfile {
    return new ProProfile(props);
  }

  // ============================================
  // GETTERS
  // ============================================

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get businessName(): string | null {
    return this.props.businessName;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  get profession(): string | null {
    return this.props.profession;
  }

  get experience(): number | null {
    return this.props.experience;
  }

  get certifications(): string[] {
    return [...this.props.certifications]; // Return copy
  }

  get address(): string | null {
    return this.props.address;
  }

  get postalCode(): string | null {
    return this.props.postalCode;
  }

  get city(): string | null {
    return this.props.city;
  }

  get latitude(): number | null {
    return this.props.latitude;
  }

  get longitude(): number | null {
    return this.props.longitude;
  }

  get radius(): number | null {
    return this.props.radius;
  }

  get siret(): string | null {
    return this.props.siret;
  }

  get corporateName(): string | null {
    return this.props.corporateName;
  }

  get legalForm(): string | null {
    return this.props.legalForm;
  }

  get legalStatus(): string | null {
    return this.props.legalStatus;
  }

  get onboardingStep(): OnboardingStep {
    return this.props.onboardingStep;
  }

  get onboardingProgress(): number {
    return this.props.onboardingProgress;
  }

  get onboardingComplete(): boolean {
    return this.props.onboardingComplete;
  }

  get validationStatus(): ValidationStatus {
    return this.props.validationStatus;
  }

  get rejectionReason(): string | null {
    return this.props.rejectionReason;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get photos(): string[] {
    return [...this.props.photos]; // Return copy
  }

  get isPremium(): boolean {
    return this.props.isPremium;
  }

  get subscriptionEnd(): Date | null {
    return this.props.subscriptionEnd;
  }

  get rating(): number | null {
    return this.props.rating;
  }

  get reviewCount(): number {
    return this.props.reviewCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ============================================
  // BUSINESS LOGIC - ONBOARDING
  // ============================================

  /**
   * Avancer à l'étape suivante de l'onboarding
   */
  advanceOnboardingStep(): void {
    const steps = [
      OnboardingStep.ENTERPRISE_INFO,
      OnboardingStep.PROFESSIONAL_INFO,
      OnboardingStep.LOCATION,
      OnboardingStep.MEDIA,
      OnboardingStep.COMPLETED,
    ];

    const currentIndex = steps.indexOf(this.props.onboardingStep);

    if (currentIndex === -1) {
      throw new ValidationError('Invalid onboarding step');
    }

    if (currentIndex >= steps.length - 1) {
      throw new ValidationError('Already at final onboarding step');
    }

    this.props.onboardingStep = steps[currentIndex + 1]!;
    this.props.onboardingProgress = Math.round(((currentIndex + 2) / steps.length) * 100);

    if (this.props.onboardingStep === OnboardingStep.COMPLETED) {
      this.props.onboardingComplete = true;
    }

    this.props.updatedAt = new Date();
  }

  /**
   * Aller à une étape spécifique de l'onboarding
   */
  setOnboardingStep(step: OnboardingStep): void {
    const steps = [
      OnboardingStep.ENTERPRISE_INFO,
      OnboardingStep.PROFESSIONAL_INFO,
      OnboardingStep.LOCATION,
      OnboardingStep.MEDIA,
      OnboardingStep.COMPLETED,
    ];

    const stepIndex = steps.indexOf(step);
    if (stepIndex === -1) {
      throw new ValidationError('Invalid onboarding step');
    }

    this.props.onboardingStep = step;
    this.props.onboardingProgress = Math.round(((stepIndex + 1) / steps.length) * 100);

    if (step === OnboardingStep.COMPLETED) {
      this.props.onboardingComplete = true;
    }

    this.props.updatedAt = new Date();
  }

  /**
   * Compléter l'onboarding manuellement
   */
  completeOnboarding(): void {
    this.props.onboardingStep = OnboardingStep.COMPLETED;
    this.props.onboardingComplete = true;
    this.props.onboardingProgress = 100;
    this.props.updatedAt = new Date();
  }

  /**
   * Vérifier si l'onboarding est complet
   */
  isOnboardingFinished(): boolean {
    return this.props.onboardingComplete || this.props.onboardingStep === OnboardingStep.COMPLETED;
  }

  // ============================================
  // BUSINESS LOGIC - VALIDATION
  // ============================================

  /**
   * Approuver le profil professionnel
   */
  approve(): void {
    if (this.props.validationStatus === ValidationStatus.APPROVED) {
      throw new ValidationError('Profile already approved');
    }

    if (!this.isOnboardingFinished()) {
      throw new ValidationError('Cannot approve profile: onboarding not complete');
    }

    this.props.validationStatus = ValidationStatus.APPROVED;
    this.props.rejectionReason = null;
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Rejeter le profil professionnel
   */
  reject(reason: string): void {
    if (!reason || reason.trim().length === 0) {
      throw new ValidationError('Rejection reason is required');
    }

    if (this.props.validationStatus === ValidationStatus.REJECTED) {
      throw new ValidationError('Profile already rejected');
    }

    this.props.validationStatus = ValidationStatus.REJECTED;
    this.props.rejectionReason = reason;
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  /**
   * Remettre en attente de validation
   */
  resetValidation(): void {
    this.props.validationStatus = ValidationStatus.PENDING;
    this.props.rejectionReason = null;
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  /**
   * Vérifier si le profil est approuvé
   */
  isApproved(): boolean {
    return this.props.validationStatus === ValidationStatus.APPROVED;
  }

  /**
   * Vérifier si le profil est rejeté
   */
  isRejected(): boolean {
    return this.props.validationStatus === ValidationStatus.REJECTED;
  }

  /**
   * Vérifier si le profil est visible publiquement
   */
  isPubliclyVisible(): boolean {
    return this.isApproved() && this.props.isActive;
  }

  // ============================================
  // BUSINESS LOGIC - PREMIUM
  // ============================================

  /**
   * Activer l'abonnement premium
   */
  activatePremium(durationInDays: number): void {
    if (durationInDays <= 0) {
      throw new ValidationError('Duration must be positive');
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationInDays);

    this.props.isPremium = true;
    this.props.subscriptionEnd = endDate;
    this.props.updatedAt = new Date();
  }

  /**
   * Vérifier si le premium est actif
   */
  isPremiumActive(): boolean {
    if (!this.props.isPremium) {
      return false;
    }

    if (!this.props.subscriptionEnd) {
      return false;
    }

    return this.props.subscriptionEnd > new Date();
  }

  /**
   * Désactiver le premium (expiration)
   */
  deactivatePremium(): void {
    this.props.isPremium = false;
    this.props.subscriptionEnd = null;
    this.props.updatedAt = new Date();
  }

  /**
   * Renouveler l'abonnement premium
   */
  renewPremium(additionalDays: number): void {
    if (additionalDays <= 0) {
      throw new ValidationError('Additional days must be positive');
    }

    if (!this.isPremiumActive()) {
      // Si expiré, réactiver à partir d'aujourd'hui
      this.activatePremium(additionalDays);
      return;
    }

    // Ajouter les jours à la date de fin actuelle
    const currentEnd = this.props.subscriptionEnd!;
    const newEnd = new Date(currentEnd);
    newEnd.setDate(newEnd.getDate() + additionalDays);

    this.props.subscriptionEnd = newEnd;
    this.props.updatedAt = new Date();
  }

  /**
   * Obtenir le nombre de jours restants de premium
   */
  getRemainingPremiumDays(): number {
    if (!this.isPremiumActive()) {
      return 0;
    }

    const now = new Date();
    const end = this.props.subscriptionEnd!;
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  // ============================================
  // BUSINESS LOGIC - PROFILE UPDATES
  // ============================================

  /**
   * Mettre à jour les informations business
   */
  updateBusinessInfo(data: {
    businessName?: string | null;
    bio?: string | null;
    profession?: string | null;
    experience?: number | null;
  }): void {
    if (data.businessName !== undefined) {
      this.props.businessName = data.businessName;
    }

    if (data.bio !== undefined) {
      this.props.bio = data.bio;
    }

    if (data.profession !== undefined) {
      this.props.profession = data.profession;
    }

    if (data.experience !== undefined) {
      if (data.experience !== null && data.experience < 0) {
        throw new ValidationError('Experience cannot be negative');
      }
      this.props.experience = data.experience;
    }

    this.props.updatedAt = new Date();
  }

  /**
   * Mettre à jour les informations légales
   */
  updateLegalInfo(data: {
    siret?: string | null;
    corporateName?: string | null;
    legalForm?: string | null;
    legalStatus?: string | null;
  }): void {
    if (data.siret !== undefined) {
      // TODO: Add SIRET validation with Value Object
      this.props.siret = data.siret;
    }

    if (data.corporateName !== undefined) {
      this.props.corporateName = data.corporateName;
    }

    if (data.legalForm !== undefined) {
      this.props.legalForm = data.legalForm;
    }

    if (data.legalStatus !== undefined) {
      this.props.legalStatus = data.legalStatus;
    }

    this.props.updatedAt = new Date();
  }

  /**
   * Mettre à jour la localisation
   */
  updateLocation(data: {
    address?: string | null;
    postalCode?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    radius?: number | null;
  }): void {
    if (data.address !== undefined) {
      this.props.address = data.address;
    }

    if (data.postalCode !== undefined) {
      this.props.postalCode = data.postalCode;
    }

    if (data.city !== undefined) {
      this.props.city = data.city;
    }

    if (data.latitude !== undefined) {
      if (data.latitude !== null && (data.latitude < -90 || data.latitude > 90)) {
        throw new ValidationError('Latitude must be between -90 and 90');
      }
      this.props.latitude = data.latitude;
    }

    if (data.longitude !== undefined) {
      if (data.longitude !== null && (data.longitude < -180 || data.longitude > 180)) {
        throw new ValidationError('Longitude must be between -180 and 180');
      }
      this.props.longitude = data.longitude;
    }

    if (data.radius !== undefined) {
      if (data.radius !== null && data.radius < 0) {
        throw new ValidationError('Radius cannot be negative');
      }
      this.props.radius = data.radius;
    }

    this.props.updatedAt = new Date();
  }

  /**
   * Vérifier si la localisation est complète
   */
  hasCompleteLocation(): boolean {
    return !!(
      this.props.address &&
      this.props.postalCode &&
      this.props.city &&
      this.props.latitude !== null &&
      this.props.longitude !== null
    );
  }

  // ============================================
  // BUSINESS LOGIC - CERTIFICATIONS
  // ============================================

  /**
   * Ajouter une certification
   */
  addCertification(certification: string): void {
    if (!certification || certification.trim().length === 0) {
      throw new ValidationError('Certification cannot be empty');
    }

    const trimmed = certification.trim();

    if (this.props.certifications.includes(trimmed)) {
      throw new ValidationError('Certification already exists');
    }

    this.props.certifications.push(trimmed);
    this.props.updatedAt = new Date();
  }

  /**
   * Supprimer une certification
   */
  removeCertification(certification: string): void {
    const index = this.props.certifications.indexOf(certification);

    if (index === -1) {
      throw new ValidationError('Certification not found');
    }

    this.props.certifications.splice(index, 1);
    this.props.updatedAt = new Date();
  }

  /**
   * Définir toutes les certifications
   */
  setCertifications(certifications: string[]): void {
    this.props.certifications = certifications.filter(c => c && c.trim().length > 0);
    this.props.updatedAt = new Date();
  }

  // ============================================
  // BUSINESS LOGIC - PHOTOS
  // ============================================

  /**
   * Ajouter une photo
   */
  addPhoto(photoUrl: string): void {
    if (!photoUrl || photoUrl.trim().length === 0) {
      throw new ValidationError('Photo URL cannot be empty');
    }

    const trimmed = photoUrl.trim();

    if (this.props.photos.includes(trimmed)) {
      throw new ValidationError('Photo already exists');
    }

    this.props.photos.push(trimmed);
    this.props.updatedAt = new Date();
  }

  /**
   * Supprimer une photo
   */
  removePhoto(photoUrl: string): void {
    const index = this.props.photos.indexOf(photoUrl);

    if (index === -1) {
      throw new ValidationError('Photo not found');
    }

    this.props.photos.splice(index, 1);
    this.props.updatedAt = new Date();
  }

  /**
   * Définir toutes les photos
   */
  setPhotos(photoUrls: string[]): void {
    this.props.photos = photoUrls.filter(url => url && url.trim().length > 0);
    this.props.updatedAt = new Date();
  }

  /**
   * Vérifier si le profil a des photos
   */
  hasPhotos(): boolean {
    return this.props.photos.length > 0;
  }

  // ============================================
  // BUSINESS LOGIC - ACTIVATION
  // ============================================

  /**
   * Activer le profil
   */
  activate(): void {
    if (!this.isApproved()) {
      throw new ValidationError('Cannot activate: profile not approved');
    }

    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Désactiver le profil
   */
  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  // ============================================
  // BUSINESS LOGIC - RATINGS
  // ============================================

  /**
   * Mettre à jour la note moyenne (appelé après ajout/suppression d'un avis)
   */
  updateRating(newRating: number, newReviewCount: number): void {
    if (newRating < 0 || newRating > 5) {
      throw new ValidationError('Rating must be between 0 and 5');
    }

    if (newReviewCount < 0) {
      throw new ValidationError('Review count cannot be negative');
    }

    this.props.rating = newReviewCount > 0 ? Math.round(newRating * 10) / 10 : null;
    this.props.reviewCount = newReviewCount;
    this.props.updatedAt = new Date();
  }

  /**
   * Vérifier si le pro a des avis
   */
  hasReviews(): boolean {
    return this.props.reviewCount > 0;
  }

  /**
   * Vérifier si le profil a une bonne note (>= 4.0)
   */
  hasGoodRating(): boolean {
    return this.props.rating !== null && this.props.rating >= 4.0;
  }

  /**
   * Vérifier si le profil a une excellente note (>= 4.5)
   */
  hasExcellentRating(): boolean {
    return this.props.rating !== null && this.props.rating >= 4.5;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Vérifier si le profil est complet (prêt pour validation)
   */
  isComplete(): boolean {
    return !!(
      this.isOnboardingFinished() &&
      this.props.businessName &&
      this.props.profession &&
      this.hasCompleteLocation() &&
      this.props.siret
    );
  }

  /**
   * Obtenir le nom d'affichage (businessName ou "Professional")
   */
  getDisplayName(): string {
    return this.props.businessName || 'Professional';
  }
}
