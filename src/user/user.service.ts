import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, EditUserDto } from './dtos';
import { User } from './entities';

export interface UserFindOne {
    id?: number;
    email?: string;
}


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    async getMany():Promise<User[]> {
        return await this.userRepository.find();
    }

    async getOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if(!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    async createOne(dto: CreateUserDto){
        const userExist = await this.userRepository.findOne({email: dto.email});
        if(userExist) throw new NotFoundException(`User with email ${dto.email} already exist`);
        const newUser = this.userRepository.create(dto);
        const userSaved = await this.userRepository.save(newUser);
        delete userSaved.password;
        return userSaved

    }

    async editOne(id: number, dto: EditUserDto) {
        const user = await this.getOne(id);
        const editeUser= Object.assign(user, dto);
        const userSaved= await this.userRepository.save(editeUser);
        delete userSaved?.password;
        return userSaved;

    }

    async deleteOne(id: number) {
        const user = await this.getOne(id);
        return await this.userRepository.remove(user);
    }

    async findOne(data: UserFindOne){
        //return await this.userRepository.findOne({email});
        return await this.userRepository
                    .createQueryBuilder('user')
                    .where(data)
                    .addSelect('user.password')
                    .getOne()
    }
}
