import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EntrepriseController } from './entreprise/controllers/entreprise.controller';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BanService } from './api/ban/ban.service';
import { PappersService } from './scraping/entreprise/pappers.service';
import { ConfigModule } from '@nestjs/config';
import { SireneService } from './api/sirene/sirene.service';
import { AppController } from './app.controller';
import { SocieteService } from './scraping/entreprise/societe.service';

@Module({
  imports: [
    EntrepriseModule,
    MongooseModule.forRoot('mongodb://localhost:27017/rpaDataCollectorDB'),
    ConfigModule.forRoot(),
  ],
  controllers: [EntrepriseController, AppController],
  providers: [AppService, BanService, PappersService, SireneService, SocieteService],
})
export class AppModule {}
