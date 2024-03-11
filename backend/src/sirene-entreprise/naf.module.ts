import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Naf, NafSchema } from './schemas/naf.schema';
import { NafService } from './services/naf.service';
import { NafDao } from './dao/naf.dao';

@Module({
  imports: [MongooseModule.forFeature([{ name: Naf.name, schema: NafSchema }])],
  controllers: [],
  providers: [NafService, NafDao],
  exports: [NafService, NafDao],
})
export class NafModule {}
