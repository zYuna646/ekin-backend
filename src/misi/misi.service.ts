import { Injectable } from '@nestjs/common';
import { CreateMisiDto } from './dto/create-misi.dto';
import { UpdateMisiDto } from './dto/update-misi.dto';

@Injectable()
export class MisiService {
  create(createMisiDto: CreateMisiDto) {
    return 'This action adds a new misi';
  }

  findAll() {
    return `This action returns all misi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} misi`;
  }

  update(id: number, updateMisiDto: UpdateMisiDto) {
    return `This action updates a #${id} misi`;
  }

  remove(id: number) {
    return `This action removes a #${id} misi`;
  }
}
