import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { ParameterService } from '../service/parameter.service';
import { ParameterEntity } from '../entity/parameter.entity';
import { UpdateParameterTimeDto } from '../dto/parameter.time.update';

@Controller('parameters')
export class ParameterController {
  constructor(private parameterService: ParameterService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ParameterEntity | null> {
    return this.parameterService.findById(id);
  }

  @Get('nameParameter/:name')
  async findByNameParameter(
    @Param('name') name: string,
  ): Promise<ParameterEntity | null> {
    return this.parameterService.findByParameterName(name);
  }

  @Get()
  async findAll(): Promise<ParameterEntity[]> {
    return this.parameterService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedParameterDto: UpdateParameterTimeDto,
  ) : Promise<ParameterEntity | null> {
    return this.parameterService.update(id, updatedParameterDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.parameterService.delete(id);
  }

  @Post()
  async create(@Body() parameter: ParameterEntity): Promise<ParameterEntity> {
    return this.parameterService.create(parameter);
  }

}
