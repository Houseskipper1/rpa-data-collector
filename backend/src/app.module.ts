import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeppersService } from './scraping/peppers/peppers.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PeppersService],
})
export class AppModule {}
