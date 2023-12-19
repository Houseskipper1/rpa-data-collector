import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EntrepriseSchema,
  EntrepriseEntitySchema,
} from './schema/entreprise.schema';
import { EntrepriseController } from './controllers/entreprise.controller';
import { EntrepriseService } from './service/entreprise.service';
import { EntrepriseDao } from './dao/entreprise-dao';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntrepriseSchema.name, schema: EntrepriseEntitySchema },
    ]),
  ],
  controllers: [EntrepriseController],
  providers: [EntrepriseService, EntrepriseDao],
  exports: [EntrepriseService, EntrepriseDao],
})

export class EntrepriseModule {}
