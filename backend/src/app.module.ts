import { Module } from '@nestjs/common';
import { EntrepriseController } from './entreprise/controllers/entreprise.controller';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BanService } from './api/ban/ban.service';
import { PappersService } from './scraping/entreprise/pappers.service';
import { ConfigModule } from '@nestjs/config';
import { SireneService } from './api/sirene/sirene.service';
import { AppController } from './app.controller';
import { SocieteService } from './scraping/entreprise/societe.service';
import { SireneEntrepriseController } from './sirene-entreprise/sirene-entreprise.controller';
import { SireneEntrepriseService } from './sirene-entreprise/services/sirene-entreprise.service';
import { SireneEntrepriseModule } from './sirene-entreprise/sirene-entreprise.module';
import { ParameterModule } from './parameter/parameter.module';
import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MONGO_URL);

@Module({
  imports: [
    EntrepriseModule,
    SireneEntrepriseModule,
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    ConfigModule.forRoot(),
    ParameterModule,
  ],
  controllers: [
    EntrepriseController,
    SireneEntrepriseController,
    AppController,
  ],
  providers: [
    BanService,
    PappersService,
    SireneService,
    SocieteService,
    SireneEntrepriseService,
  ],
})
export class AppModule {}
