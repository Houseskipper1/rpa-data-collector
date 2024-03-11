import { Injectable } from '@nestjs/common';
import { Naf } from '../schemas/naf.schema';
import { NafEntity } from '../entities/naf.entity';
import { NafDao } from '../dao/naf.dao';

@Injectable()
export class NafService {
  constructor(private readonly _nafDao: NafDao) {}

  async findById(id: string): Promise<Naf> {
    return this._nafDao.findById(id);
  }

  async findByCode(code: string): Promise<Naf> {
    return this._nafDao.findByCode(code);
  }

  async create(naf: NafEntity): Promise<NafEntity> {
    return await this._nafDao.save(naf);
  }
}
