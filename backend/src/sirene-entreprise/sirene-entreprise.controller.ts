import {
    Controller,
    Get
} from '@nestjs/common';
import { SireneEntrepriseEntity } from './entities/sirene-entreprise.entity';
import { SireneEntrepriseService } from './services/sirene-entreprise.service';
import { ApiTags } from '@nestjs/swagger';

/**
 * Controller for handling operations related to sireneEntreprises entities
 */
@Controller('sireneEntreprise')
@ApiTags('sireneEntreprise')
export class SireneEntrepriseController {
    /**
     * 
     * @param _sireneEntrepriseService Service for SireneEntreprise
     */
    constructor(
        private _sireneEntrepriseService: SireneEntrepriseService,
    ) { }

    /**
     * 
     * @returns {Promise<SireneEntrepriseEntity[]>} sireneEntreprises
     */
    @Get()
    async findAll(): Promise<SireneEntrepriseEntity[]> {
        return this._sireneEntrepriseService.findAll();
    }

}
