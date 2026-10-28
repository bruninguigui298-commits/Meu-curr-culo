import type { Request, Response } from 'express';
import type { ContactService } from '../services/contactService.js';
import { parseId } from './parseId.js';

export class ContactController {
  constructor(private readonly service: ContactService) {}

  send = async (req: Request, res: Response) => {
    res.status(201).json(await this.service.send(req.body));
  };

  list = async (_req: Request, res: Response) => {
    res.json({ messages: await this.service.list() });
  };

  markRead = async (req: Request, res: Response) => {
    res.json({ message: await this.service.markRead(parseId(req.params.id)) });
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(parseId(req.params.id));
    res.status(204).end();
  };
}
