import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EntrepriseSchema,
  EntrepriseEntitySchema,
} from './schema/entreprise.schema';
import { EntrepriseController } from './controllers/entreprise.controller';
import { EntrepriseService } from './service/entreprise.service';
import { EntrepriseDao } from './dao/entreprise-dao';
import { PappersService } from 'src/scraping/entreprise/pappers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntrepriseSchema.name, schema: EntrepriseEntitySchema },
    ]),
  ],
  controllers: [EntrepriseController],
  providers: [EntrepriseService, EntrepriseDao, PappersService],
  exports: [EntrepriseService, EntrepriseDao],
})
export class EntrepriseModule {}
