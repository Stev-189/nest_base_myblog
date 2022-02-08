import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto, EditPostDto } from './dtos';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async getMany(): Promise<Post[]> {
        return await this.postRepository.find();
    }

    async getOne(id:number) {
        const one= await this.postRepository.findOne(id);
        if(!one) throw new NotFoundException()
        return one;
    }

    async editOne(id:number, dto:EditPostDto) {
        const post = await this.postRepository.findOne(id);
        if(!post) throw new NotFoundException("Post not found")
        const editedPost = Object.assign(post, dto);
        return await this.postRepository.save(editedPost);
    }

    async createOne(dto:CreatePostDto) {
        const post = this.postRepository.create(dto as any);
        return await this.postRepository.save(post);
    }

    async deleteOne(id:number) {
        return await this.postRepository.delete(id)
    }
}
