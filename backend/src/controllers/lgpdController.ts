import type { Request, Response } from 'express';
import type { LgpdService } from '../services/lgpdService.js';
import { parseId } from './parseId.js';

export class LgpdController {
  constructor(private readonly service: LgpdService) {}

  create = async (req: Request, res: Response) => {
    res.status(201).json(await this.service.create(req.body));
  };

  lookup = async (req: Request, res: Response) => {
    res.json(await this.service.lookup(req.body));
  };

  list = async (_req: Request, res: Response) => {
    res.json({ requests: await this.service.list() });
  };

  updateStatus = async (req: Request, res: Response) => {
    res.json({ request: await this.service.updateStatus(parseId(req.params.id), req.body) });
  };
}
