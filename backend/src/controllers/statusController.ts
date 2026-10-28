import type { Request, Response } from 'express';
import type { StatusService } from '../services/statusService.js';

export class StatusController {
  constructor(private readonly service: StatusService) {}

  list = async (_req: Request, res: Response) => {
    const snapshot = await this.service.getAll();
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(snapshot);
  };
}
