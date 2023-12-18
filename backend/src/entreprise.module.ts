import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrepriseSchema, EntrepriseEntitySchema } from './entreprise/schema/entreprise.schema';
import { EntrepriseController } from './entreprise/controllers/entreprise.controller';
import { EntrepriseService } from './entreprise/service/entreprise.service';
import { EntrepriseDao } from './entreprise/dao/entreprise-dao';

@Module({
  imports: [MongooseModule.forFeature([{ name: EntrepriseSchema.name, schema: EntrepriseEntitySchema }])],
  controllers: [EntrepriseController],
  providers: [EntrepriseService, EntrepriseDao],
  exports : [EntrepriseService, EntrepriseDao]
})
export class EntrepriseModule {}
