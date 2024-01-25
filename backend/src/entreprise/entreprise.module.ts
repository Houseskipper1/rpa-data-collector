import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entreprise, EntrepriseSchema } from './schema/entreprise.schema';
import { EntrepriseController } from './controllers/entreprise.controller';
import { EntrepriseService } from './service/entreprise.service';
import { EntrepriseDao } from './dao/entreprise-dao';
import { PappersService } from 'src/scraping/entreprise/pappers.service';
import { BanService } from 'src/api/ban/ban.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entreprise.name, schema: EntrepriseSchema },
    ]),
  ],
  controllers: [EntrepriseController],
  providers: [EntrepriseService, EntrepriseDao, PappersService, BanService],
  exports: [EntrepriseService, EntrepriseDao, BanService],
})
export class EntrepriseModule {}
