import { Controller, Get, Param, Put, Body, Delete, Post } from '@nestjs/common';
import { ParameterService } from '../service/parameter.service';
import { ParameterEntity } from '../entity/parameter.entity';

@Controller('parameters')
export class ParameterController {
  constructor(private parameterService: ParameterService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ParameterEntity | null> {
    return this.parameterService.findById(id);
  }

  @Get()
  async findAll(): Promise<ParameterEntity[]> {
    return this.parameterService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedParameter: Partial<ParameterEntity>,
  ): Promise<ParameterEntity | null> {
    return this.parameterService.update(id, updatedParameter);
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
