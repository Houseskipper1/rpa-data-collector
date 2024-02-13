import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SireneEntreprise, SireneEntrepriseSchema } from "./schemas/sirene-entreprise.schema";
import { SireneEntrepriseController } from "./sirene-entreprise.controller";
import { SireneEntrepriseService } from "./services/sirene-entreprise.service";
import { SireneEntrepriseDao } from "./dao/sirene-entreprise.dao";
import { NafService } from "./services/naf.service";
import { NafModule } from "./naf.module";
import { NafDao } from "./dao/naf.dao";
import { Naf, NafSchema } from "./schemas/naf.schema";

@Module({
    imports: [
      NafModule,
      MongooseModule.forFeature([
        { name: SireneEntreprise.name, schema: SireneEntrepriseSchema },
        { name: Naf.name, schema: NafSchema } 
      ]),
    ],
    controllers: [SireneEntrepriseController],
    providers: [SireneEntrepriseService, NafService, SireneEntrepriseDao, NafDao],
    exports: [SireneEntrepriseService, SireneEntrepriseDao, NafService],

  })
  export class SireneEntrepriseModule {}