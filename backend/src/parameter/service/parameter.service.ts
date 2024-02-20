import { Injectable } from '@nestjs/common';
import { ParameterDao } from '../dao/parameter.dao';
import { ParameterEntity } from '../entity/parameter.entity';

@Injectable()
export class ParameterService {
  constructor(private readonly parameterDao: ParameterDao) {}

  async findById(id: string): Promise<ParameterEntity | null> {
    return this.parameterDao.findById(id);
  }

  async findAll(): Promise<ParameterEntity[]> {
    return this.parameterDao.findAll();
  }

  async update(
    id: string,
    updatedParameter: Partial<ParameterEntity>,
  ): Promise<ParameterEntity | null> {
    return this.parameterDao.update(id, updatedParameter);
  }

  async delete(id: string): Promise<void> {
    return this.parameterDao.delete(id);
  }

  async create(parameter: ParameterEntity): Promise<ParameterEntity> {
    return this.parameterDao.save(parameter);
  }

  async findByParameterName(parameterName: string): Promise<ParameterEntity | null> {
    return this.parameterDao.findByParameterName(parameterName);
  }
}
