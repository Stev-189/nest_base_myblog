import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, EditUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    async getMany() {
        const data= await this.userService.getMany();
        return {
            result:true,
            message: "Peticion satisfactoria",
            data
        }
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        const data= await this.userService.getOne(id);
        return {
            result:true,
            message: "Peticion satisfactoria",
            data
        }
    }

    @Post()
    async createOne(@Body() dto: CreateUserDto) {
        const data= await this.userService.createOne(dto);
        return {
            result:true,
            message: "Usuario Creado",
            data
        }
    }

    @Put(':id')
    async editOne(
        @Param('id') id: number,
        @Body() dto: EditUserDto
    ) {
        const data= await this.userService.editOne(id, dto);
        return {
            result:true,
            message: "Usuario Editado",
            data
        }
    }

    @Delete(':id')
    async deleteOne(
        @Param('id') id: number
    ) {
        const data= await this.userService.deleteOne(id);
        return {
            result:true,
            message: "Usuario Eliminado",
            data
        }
    }
}
