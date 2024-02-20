import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Parameter, ParameterSchema } from './schema/parameter.schema';
import { ParameterController } from './controller/paremeter.controller';
import { ParameterService } from './service/parameter.service';
import { ParameterDao } from './dao/parameter.dao';

@Module({})

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Parameter.name, schema: ParameterSchema },
      ]),
      
    ],
    controllers: [ParameterController],
    providers: [ParameterService, ParameterDao],
    exports: [ParameterService, ParameterDao],
  })
export class ParameterModule {}
