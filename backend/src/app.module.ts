import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EntrepriseController } from './entreprise/controllers/entreprise.controller';
import { EntrepriseModule } from './entreprise.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BanService } from './api/ban/ban.service';
import { PeppersService } from './scraping/peppers/peppers.service';


@Module({
  imports: [EntrepriseModule, MongooseModule.forRoot('mongodb://localhost:27017/rpaDataCollectorDB'), 
],
  controllers: [EntrepriseController, AppController],
  providers: [AppService, BanService, PeppersService],
})
export class AppModule {}
