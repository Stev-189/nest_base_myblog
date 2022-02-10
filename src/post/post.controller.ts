import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.roles';

import { Auth, User } from 'src/common/decorators';
import { CreatePostDto, EditPostDto } from './dtos';
import { PostService } from './post.service';
import { User as UserEntity } from 'src/user/entities';

@ApiTags('Posts')
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
        ) {}

    @Get()
    async getMany() {
        const data = await this.postService.getMany();
        return {
            result:true,
            message: "Peticion satisfactoria",
            data
        }
    }

    @Get(':id')
    async getOne(@Param ("id", ParseIntPipe)id:number) {
        const data = await this.postService.getOne(id);
        return {
            result:true,
            message: "Peticion satisfactoria",
            data
        }
    }

   /*  @Auth()
    @Post()
    async createOne(@Body() dto: CreatePostDto) {
        const data= await this.postService.createOne(dto);
        return {
            result:true,
            message: "Creacion satisfactoria",
            data
        };
    } */

    @Auth({
        resource: AppResource.POST,
        action: 'create',
        possession: 'own',
      })
      @Post()
      async createOne(@Body() dto: CreatePostDto, @User() author: UserEntity) {
        const data = await this.postService.createOne(dto, author);
        return { 
            result: true,
            message: 'Post created', 
            data };
      }

    /* @Auth()
    @Put(':id')
     async updateOne(@Param ("id", ParseIntPipe)id:number,
              @Body() dto: EditPostDto){
        const data = await this.postService.editOne(id, dto);
        return {
            result:true,
            message: "Actualizacion satisfactoria",
            data
        }
    }

    @Auth()
    @Delete(':id')
    async deleteOne(@Param ("id", ParseIntPipe)id:number) {
        const data = await this.postService.deleteOne(id);
        return {
            result:true,
            message: "Eliminacion satisfactoria",
            data
        }
    } */

    @Auth({
        resource: AppResource.POST,
        action: 'update',
        possession: 'own',
      })
      @Put(':id')
      async editOne(
        @Param('id') id: number,
        @Body() dto: EditPostDto,
        @User() author: UserEntity,
      ) {
        let data;
    
        if (
          this.rolesBuilder.can(author.roles).updateAny(AppResource.POST).granted
        ) {
          // Puede editar cualquier POST...
          data = await this.postService.editOne(id, dto);
        } else {
          // Puede editar solo los propios...
          data = await this.postService.editOne(id, dto, author);
        }
    
        return { 
            result: true,
            message: 'Post edited', 
            data };
      }
    
      @Auth({
        resource: AppResource.POST,
        action: 'delete',
        possession: 'own',
      })
      @Delete(':id')
      async deleteOne(@Param('id') id: number, @User() author: UserEntity) {
        let data;
    
        if (
          this.rolesBuilder.can(author.roles).deleteAny(AppResource.POST).granted
        ) {
          data = await this.postService.deleteOne(id);
        } else {
          data = await this.postService.deleteOne(id, author);
        }
        return { 
            result: true,
            message: 'Post deleted', 
            data };
      }

}
