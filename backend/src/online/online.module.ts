import { Module } from '@nestjs/common';
import { OnlineController } from './online.controller';
import { OnlineService } from './online.service';
import { OnlineGateway } from './online.gateway';

@Module({
  controllers: [OnlineController],
  providers: [OnlineService, OnlineGateway],
})
export class OnlineModule { }
  