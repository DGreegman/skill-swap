import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Welcome to Skill Swap, a matching-based system where users post Skill Offers and Skill Requests, chat, schedule sessions, and track completed exchanges</h1>';
  }
}
