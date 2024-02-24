import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ParameterDao } from '../dao/parameter.dao';
import { ParameterEntity } from '../entity/parameter.entity';
import { UpdateParameterTimeDto } from '../dto/parameter.time.update';

@Injectable()
export class ParameterService {
  constructor(private readonly parameterDao: ParameterDao) {}

  async findById(id: string): Promise<ParameterEntity | null> {
    try {
      const parameter = await this.parameterDao.findById(id);
      if (!parameter) {
        throw new NotFoundException(`Parameter with id '${id}' not found`);
      }
      return parameter;
    } catch (error) {
      throw new NotFoundException(`Parameter with id '${id}' not found`);
    }
  }

  async findAll(): Promise<ParameterEntity[]> {
    return this.parameterDao.findAll();
  }

  async update(
    id: string, 
    updatedParameterDto: UpdateParameterTimeDto, 
  ): Promise<ParameterEntity | null> { 
    const parameterToUpdate = await this.findById(id);
    parameterToUpdate.refreshFrequency = updatedParameterDto.refreshFrequency;
    await this.parameterDao.update(id, parameterToUpdate);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.parameterDao.delete(id);
  }

  async create(parameter: ParameterEntity): Promise<ParameterEntity> {
    const existingParameter = await this.findByParameterName(
      parameter.parameterName,
    );
    if (existingParameter) {
      throw new ConflictException(
        `Parameter with name '${parameter.parameterName}' already exists.`,
      );
    }
    return this.parameterDao.save(parameter);
  }

  async findByParameterName(
    parameterName: string,
  ) : Promise<ParameterEntity | null> {
    try {
      const parameter =
        await this.parameterDao.findByParameterName(parameterName);
      if (!parameter) {
        throw new NotFoundException(
          `Parameter with name '${parameterName}' not found`,
        );
      }
      return parameter;
    } catch (error) {
      throw new NotFoundException(
        `Parameter with name '${parameterName}' not found`,
      );
    }
  }
}
