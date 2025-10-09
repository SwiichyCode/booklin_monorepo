import type { NextFunction, Request, Response } from 'express';
import { ProProfileService } from './pro-profile.service';
import { CreateProProfileSchema, UpdateProProfileSchema } from './pro-profile.types';

export class ProProfileController {
  constructor(private service: ProProfileService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateProProfileSchema.parse(req.body);
      const result = await this.service.createProfile(dto);

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, error: 'Profile ID is required' });

      const profile = await this.service.findById(id);
      if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const profile = await this.service.findByUserId(userId);
      if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = UpdateProProfileSchema.parse(req.body);

      if (!id) return res.status(400).json({ success: false, error: 'Profile ID is required' });
      const updated = await this.service.updateProfile(id, dto);

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ success: false, error: 'Profile ID is required' });
      await this.service.deleteProfile(id);

      res.json({ success: true, message: 'Profile deleted' });
    } catch (error) {
      next(error);
    }
  };
}
