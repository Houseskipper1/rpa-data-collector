import {
    Controller,
    Get,
    Body,
    Post,
} from '@nestjs/common';
import { SireneEntrepriseEntity } from './entities/sirene-entreprise.entity';
import { SireneEntrepriseService } from './services/sirene-entreprise.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('sireneEntreprise')
@ApiTags('sireneEntreprise')
export class SireneEntrepriseController {
    constructor(
        private _sireneEntrepriseService: SireneEntrepriseService,
    ) { }

    @Get()
    async findAll(): Promise<SireneEntrepriseEntity[]> {
        return this._sireneEntrepriseService.findAll();
    }

}
