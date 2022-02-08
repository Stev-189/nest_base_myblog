import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePostDto, EditPostDto } from './dtos';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

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

    @Post()
    async createOne(@Body() dto: CreatePostDto) {
        const data= await this.postService.createOne(dto);
        return {
            result:true,
            message: "Creacion satisfactoria",
            data
        };
    }

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

    @Delete(':id')
    async deleteOne(@Param ("id", ParseIntPipe)id:number) {
        const data = await this.postService.deleteOne(id);
        return {
            result:true,
            message: "Eliminacion satisfactoria",
            data
        }
    }

}
