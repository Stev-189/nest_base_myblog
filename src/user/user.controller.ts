import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

import { AppResource, AppRoles } from 'src/app.roles';
import { Auth, User } from 'src/common/decorators';
import { CreateUserDto, EditUserDto, UserRegistrationDto } from './dtos';
import { UserService } from './user.service';
import { User as UserEntity } from './entities';

@ApiTags('User Routes')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
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

    @Post('register')
    async publicRegistration(@Body() dto: UserRegistrationDto) {
      const data = await this.userService.createOne({
        ...dto,
        roles: [AppRoles.AUTHOR],
      });
      return { 
        result: true,
        message: 'Usuario Creado',
        data,
       };
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

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResource.USER,
    })
    @Post()
    async createOne(@Body() dto: CreateUserDto) {
        const data= await this.userService.createOne(dto);
        return {
            result:true,
            message: "Usuario Creado",
            data
        }
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResource.USER,
    })
    @Put(':id')
    async editOne(
        @Param('id') id: number,
        @Body() dto: EditUserDto,
        @User() user: UserEntity
    ) {
        let data:any;
        if(this.rolesBuilder
                .can(user.roles)
                .updateAny(AppResource.USER)
                .granted
        ) {
            data= await this.userService.editOne(id, dto);
            // esto es un admin
            //console.log('admin');
        }else {
            // esto es un author
            const {roles, ...rest} = dto;// para que author no pueda editar roles
            data= await this.userService.editOne(id, rest, user);
            //console.log('author');
        }
        return {
            result:true,
            message: "Usuario Editado",
            data
        }
    }

    @Auth({
        action: 'delete',
        possession: 'own',
        resource: AppResource.USER,
    })
    @Delete(':id')
    async deleteOne(
        @Param('id') id: number,
        @User() user: UserEntity
    ) {

        let data:any;
        if(this.rolesBuilder
                .can(user.roles)
                .updateAny(AppResource.USER)
                .granted
        ) {
            data= await this.userService.deleteOne(id);
            // esto es un admin
            //console.log('admin');
        }else {
            // esto es un author
            data= await this.userService.deleteOne(id, user);
            //console.log('author');
        }
        return {
            result:true,
            message: "Usuario Eliminado",
            data
        }
    }
}
