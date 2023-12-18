import { Injectable } from '@nestjs/common';

@Injectable()
export class OnlineService {
  game(): any {
    return 'hi2';
  }
}
