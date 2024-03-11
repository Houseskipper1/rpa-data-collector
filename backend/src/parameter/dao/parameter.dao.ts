import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Parameter } from '../schema/parameter.schema';
import { ParameterEntity } from '../entity/parameter.entity';

@Injectable()
export class ParameterDao {
  constructor(
    @InjectModel(Parameter.name)
    private readonly _parameterModel: Model<Parameter>,
  ) {}

  async save(parameter: ParameterEntity): Promise<Parameter> {
    const newParameter = new this._parameterModel(parameter);
    return await newParameter.save();
  }

  async findById(id: string): Promise<Parameter | null> {
    return await this._parameterModel.findById(id).exec();
  }

  async findByParameterName(parameterName: string): Promise<Parameter | null> {
    return await this._parameterModel.findOne({ parameterName });
  }

  async findAll(): Promise<Parameter[]> {
    return await this._parameterModel.find().exec();
  }

  async update(
    id: string,
    updatedParameter: Partial<ParameterEntity>,
  ): Promise<Parameter | null> {
    return await this._parameterModel
      .findByIdAndUpdate(id, updatedParameter, { new: false })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this._parameterModel.findByIdAndDelete(id).exec();
  }
}
