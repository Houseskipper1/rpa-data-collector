import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BanService } from './api/ban/ban.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BanService],
})
export class AppModule {}
